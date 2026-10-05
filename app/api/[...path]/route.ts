import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
// Shared service has the same policy in Workers, the portable server and tests.
import {service} from '../../../lib/relay/service.mjs';
export const dynamic='force-dynamic';
async function handle(request:Request){
 const bindings=env as unknown as Record<string,unknown>;
 const user=await getChatGPTUser();
 const token=String(bindings.RELAY_INGEST_TOKEN||'');
 const identity=user?{id:user.userId,label:user.displayName}:token&&request.headers.get('authorization')==='Bearer '+token?{id:'ingestion-agent',role:'agent',label:'Source ingestion agent'}:null;
 return service(request,bindings,identity);
}
export const GET=handle;
export const POST=handle;
