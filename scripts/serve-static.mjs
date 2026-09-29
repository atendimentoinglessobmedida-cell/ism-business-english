import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const root=process.argv.includes('--dist')?path.join(repo,'dist'):repo;
if(!fs.existsSync(path.join(root,'index.html')))throw new Error('Run the build before serving dist.');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{return res.writeHead(400).end()}
  const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  const relative=path.relative(root,file);
  const allowed=!relative.startsWith('..')&&!path.isAbsolute(relative)&&(relative.startsWith('assets'+path.sep)||(!relative.includes(path.sep)&&Object.hasOwn(mime,path.extname(file))));
  if(!allowed)return res.writeHead(404).end();
  fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data)});
});
server.listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log(`ISM Business English: http://127.0.0.1:${server.address().port}`));
