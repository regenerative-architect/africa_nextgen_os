import {DatabaseSync} from 'node:sqlite';
export class SQLiteD1{
 constructor(path=':memory:'){this.sqlite=new DatabaseSync(path);this.sqlite.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');}
 prepare(sql){const db=this.sqlite;const stmt=db.prepare(sql);let args=[];const wrapper={bind(...values){args=values;return wrapper;},async first(){return stmt.get(...args)||null;},async all(){return {results:stmt.all(...args)};},async run(){const result=stmt.run(...args);return {meta:{changes:Number(result.changes),last_row_id:Number(result.lastInsertRowid)},results:[]};}};return wrapper;}
 async batch(statements){this.sqlite.exec('BEGIN IMMEDIATE');try{const result=[];for(const stmt of statements)result.push(await stmt.run());this.sqlite.exec('COMMIT');return result;}catch(e){this.sqlite.exec('ROLLBACK');throw e;}}
 close(){this.sqlite.close();}
}
