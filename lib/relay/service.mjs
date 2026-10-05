import {Repository} from './repository.mjs';
import {RelayError,demand,PERMISSIONS,normalizeDraft,reviewAlert,publishAlert,addOutcome,text,publicAlert,eligible,distributable,visibleRecord,safeURL,canonical,digest} from './core.mjs';
import {capXML,feed,hxlCSV,rapidProPayload} from './outputs.mjs';
import {makePack} from './packs.mjs';
import {SPINE,REFERENCES} from './spine.mjs';
const json=(v,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function service(request,env,identity,{now=new Date().toISOString(),fetcher=fetch}={}){
 try{
 const url=new URL(request.url);const path=url.pathname.replace(/^\/api\/?/,'');const method=request.method;
 if(method!=='GET'&&method!=='POST')throw new RelayError(405,'Method not allowed.');
 if(method==='POST'){
  if(request.headers.get('origin')!==url.origin)throw new RelayError(403,'Same-origin request required.');
  if(!request.headers.get('content-type')?.startsWith('application/json'))throw new RelayError(415,'JSON content type required.');
  if(Number(request.headers.get('content-length')||0)>1048576)throw new RelayError(413,'Import exceeds one megabyte.');
 }
 if(path==='spine'&&method==='GET')return json(SPINE);
 const repo=new Repository(env.DB);const records=await repo.all();const reference=REFERENCES.map(a=>publicAlert(a,now));
 if(path==='snapshot'&&method==='GET')return json({profile:'acr/1.0',generatedAt:now,alerts:[...records.filter(a=>distributable(a,now)).map(a=>publicAlert(a,now)),...reference],spine:SPINE});
 if(path.startsWith('feeds/')&&method==='GET'){const type=path.split('/')[1];if(!['rss','atom','json','hxl'].includes(type))throw new RelayError(404,'Feed format not found.');return new Response(type==='hxl'?hxlCSV(records.filter(a=>distributable(a,now)),now):feed(records,type,{base:url.origin,now}),{headers:{'Content-Type':type==='json'?'application/feed+json':type==='hxl'?'text/csv; charset=utf-8':type==='atom'?'application/atom+xml':'application/rss+xml','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
 if(path.startsWith('packs/')&&method==='GET'){const region=path.split('/')[1];if(!SPINE.regions.some(r=>r.id===region))throw new RelayError(404,'Regional pack not found.');return json(await makePack(region,[...records,...REFERENCES],SPINE,now));}
 if(path.startsWith('cap/')&&method==='GET'){const a=records.find(a=>a.id===path.slice(4)&&distributable(a,now))||REFERENCES.find(a=>a.id===path.slice(4));if(!a)throw new RelayError(404,'Public CAP alert not found.');return new Response(capXML(a,{base:url.origin,sender:url.hostname,now}),{headers:{'Content-Type':'application/xml','Cache-Control':'no-store'}});}
 if(!identity)throw new RelayError(401,'Sign in to the relay to synchronize or review.');
 let actor=identity.role==='agent'?identity:await repo.member(identity.id)||{...identity,role:'viewer'};
 if(path==='identity'&&method==='GET')return json({actor,initialized:(await repo.roster()).length>0,ownerBootstrap:env.RELAY_OWNER_BOOTSTRAP==='private-owner'});
 if(path==='bootstrap'&&method==='POST'){if(env.RELAY_OWNER_BOOTSTRAP!=='private-owner'||identity.role==='agent')throw new RelayError(403,'Private owner initialization is disabled.');actor=await repo.bootstrap(identity);return json({actor},201);}
 if(path==='workspace'&&method==='GET'){
  if(actor.role==='agent')throw new RelayError(403,'Ingestion agents cannot read the internal workspace.');
  return json({actor,alerts:records.map(a=>visibleRecord(a,actor,now)).filter(Boolean),feedback:['reviewer','governor'].includes(actor.role)?await repo.feedbackList():[],members:actor.role==='governor'?await repo.roster():[],generatedAt:now});
 }
 if(path.startsWith('audit/')&&method==='GET'){demand(actor,'review');return json(await repo.audit(path.slice(6)));}
 if(method!=='POST')throw new RelayError(404,'Route not found.');
 const reader=request.body?.getReader();let size=0;const pieces=[];if(reader){for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>1048576){await reader.cancel();throw new RelayError(413,'Import exceeds one megabyte.');}pieces.push(value);}}const combined=new Uint8Array(size);let offset=0;for(const piece of pieces){combined.set(piece,offset);offset+=piece.byteLength;}const raw=new TextDecoder().decode(combined);if(raw.length>1048576)throw new RelayError(413,'Import exceeds one megabyte.');let body;try{body=JSON.parse(raw);}catch{throw new RelayError(400,'Malformed JSON.');}
 if(!body||Array.isArray(body)||typeof body!=='object')throw new RelayError(422,'JSON object required.');
 const commandId=text(body.commandId,120);if(!/^[\w.-]{8,120}$/.test(commandId))throw new RelayError(422,'Unique command ID required.');
 const commandAction=path==='members'?'members':path==='drafts'?'draft':path==='feedback'?'feedback':path==='feedback-review'?'review':path.endsWith('/revise')?'draft':path.split('/').at(-1);demand(actor,commandAction);const previous=await repo.command(commandId);if(previous){const expectedKind=path==='drafts'?'draft-created':path.split('/').at(-1);if(previous.kind!==expectedKind)throw new RelayError(409,'Command ID was used for a different action.');if(previous.actor!==actor.id)throw new RelayError(409,'Command belongs to another actor.');if(actor.role==='agent')return json({replayed:true,id:previous.alert_id});if(previous.alert_id==='governance'||path==='feedback'||path==='feedback-review')return json({replayed:true});const record=visibleRecord(await repo.get(previous.alert_id),actor,now);if(!record)throw new RelayError(403,'Record is no longer visible to this role.');return json({replayed:true,alert:record});}
 if(path==='members'){demand(actor,'members');if(!text(body.id,120)||!Object.keys(PERMISSIONS).filter(r=>r!=='agent').includes(body.role))throw new RelayError(422,'Valid human identity and role required.');if(body.id===actor.id&&body.role!=='governor')throw new RelayError(409,'The governor cannot remove their own governance access.');await repo.assign({id:text(body.id,120),role:body.role,label:text(body.label,120)||text(body.id,120)},{id:commandId,actor:actor.id,at:now});return json({members:await repo.roster()});}
 if(path==='drafts'){demand(actor,'draft');const a=normalizeDraft(body.alert,actor,now);return json({alert:await repo.insert(a,commandId)},201);}
 if(path==='feedback'){demand(actor,'feedback');const categories=['correct','local-context','service-change','unsafe-location','already-occurring','outdated'];if(!categories.includes(body.category)||text(body.message).length<10)throw new RelayError(422,'Correction category and at least ten characters required.');if(!records.some(a=>a.id===body.alertId)&&!REFERENCES.some(a=>a.id===body.alertId))throw new RelayError(404,'Feedback alert not found.');const f={id:commandId,alertId:body.alertId,actor:actor.id,category:body.category,message:text(body.message),at:now,status:'pending'};return json({feedback:await repo.addFeedback(f)},201);}
 if(path==='feedback-review'){demand(actor,'review');if(!['accepted','rejected','needs-context'].includes(body.status))throw new RelayError(422,'Invalid correction decision.');await repo.feedbackStatus(body.id,body.status,{id:commandId,actor:actor.id,at:now});return json({feedback:await repo.feedbackList()});}
 const match=path.match(/^alerts\/([\w.-]+)\/(review|publish|revise|cancel|outcome|relay)$/);if(!match)throw new RelayError(404,'Route not found.');const [,id,action]=match;const a=await repo.get(id);if(body.revision!==a.revision)throw new RelayError(409,'Revision conflict. Reload before continuing.');let next;
 if(action==='review')next=reviewAlert(a,actor,body.decision,body.note,now);
 if(action==='publish'){next=publishAlert(a,actor,now);if(a.supersedes){const previous=await repo.get(a.supersedes);if(!previous.publishedAt||previous.privacy!=='public'||a.privacy!=='public'||previous.id===a.id)throw new RelayError(422,'Updates require a previously published public message.');next.references=[{id:previous.id,revision:previous.publication?.revision||previous.revision,sent:previous.publishedAt}];}}
 if(action==='revise'){demand(actor,'draft');if(['published','cancelled'].includes(a.workflow))throw new RelayError(409,'Published and cancelled messages are immutable. Prepare a new candidate linked to this message.');if(actor.id!==a.author&&actor.role!=='governor')throw new RelayError(403,'Only the author or governor may revise.');next={...normalizeDraft({...body.alert,id:a.id},actor,now),revision:a.revision+1,createdAt:a.createdAt,updatedAt:now};next.provenanceHash=await digest({claims:next.claims,sources:next.sources,geo:next.geo,observedAt:next.observedAt});}
 if(action==='cancel'){demand(actor,'cancel');if(text(body.note).length<10)throw new RelayError(422,'Cancellation reason required.');next={...a,workflow:'cancelled',revision:a.revision+1,updatedAt:now,cancellation:{note:text(body.note),at:now,actor:actor.id,previousRevision:a.publication?.revision||a.revision}};}
 if(action==='outcome')next=addOutcome(a,actor,body.outcome,now);
 if(action==='relay'){
  demand(actor,'relay');if(!env.RAPIDPRO_TOKEN||!env.RAPIDPRO_ORIGIN||!env.RAPIDPRO_FLOW||!env.RAPIDPRO_GROUPS)throw new RelayError(503,'RapidPro is unconfigured. Download a reviewed payload for administrator setup.');
  const origin=safeURL(env.RAPIDPRO_ORIGIN);if(!origin||new URL(origin).pathname!=='/')throw new RelayError(503,'RapidPro origin must be an HTTPS origin.');
  const payload=rapidProPayload(a,env.RAPIDPRO_FLOW,env.RAPIDPRO_GROUPS.split(','),now);
  const dispatchKey=await digest({id:a.id,revision:a.revision,flow:payload.flow,groups:payload.groups});
  if(!await repo.reserveDispatch(dispatchKey,a.id,a.revision,now))return json({receipt:await repo.dispatch(dispatchKey),duplicate:true});
  try{const result=await fetcher(new URL('/api/v2/flow_starts.json',origin),{method:'POST',headers:{Authorization:'Token '+env.RAPIDPRO_TOKEN,'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000),redirect:'error'});const status=result.ok?'accepted':result.status===429?'rate-limited':'failed';const receipt={upstreamStatus:result.status,retryAfter:result.headers.get('Retry-After'),at:now,delivery:'unverified',outcome:'unverified'};await repo.recordDispatch(dispatchKey,status,receipt);return json({status,receipt},result.ok?202:502);}catch{await repo.recordDispatch(dispatchKey,'uncertain',{at:now,delivery:'uncertain — reconcile in RapidPro before retrying'});throw new RelayError(502,'Dispatch result uncertain. Check RapidPro before any retry.');}
 }
 return json({alert:await repo.update(a,next,actor,action,commandId)});
 }catch(e){if(e instanceof RelayError)return json({error:e.message},e.status);console.error('Relay request failed',e instanceof Error?e.message:'unknown');return json({error:'The relay could not complete this request. Your local input is preserved. Check durable storage and retry after recovery.'},503);}
}
