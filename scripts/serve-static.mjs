import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const root=process.argv.includes('--dist')?path.join(repo,'dist'):repo;
if(!fs.existsSync(path.join(root,'index.html')))throw new Error('Run the build before serving dist.');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.mp3':'audio/mpeg','.avif':'image/avif','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{return res.writeHead(400).end()}
  const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  const relative=path.relative(root,file);
  const allowed=!relative.startsWith('..')&&!path.isAbsolute(relative)&&(relative.startsWith('assets'+path.sep)||(!relative.includes(path.sep)&&Object.hasOwn(mime,path.extname(file))));
  if(!allowed)return res.writeHead(404).end();
  fs.readFile(file,(error,data)=>{
    if(error)return res.writeHead(404).end();
    res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
    res.setHeader('Accept-Ranges','bytes');
    const range=req.headers.range;
    if(range){
      const match=/^bytes=(\d*)-(\d*)$/.exec(range);
      if(!match||(!match[1]&&!match[2]))return res.writeHead(416,{'Content-Range':`bytes */${data.length}`}).end();
      const start=match[1]?Number(match[1]):Math.max(0,data.length-Number(match[2]));
      const end=match[1]&&match[2]?Math.min(Number(match[2]),data.length-1):data.length-1;
      if(start>end||start>=data.length)return res.writeHead(416,{'Content-Range':`bytes */${data.length}`}).end();
      const part=data.subarray(start,end+1);res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':part.length});return res.end(req.method==='HEAD'?undefined:part);
    }
    res.setHeader('Content-Length',data.length);res.end(req.method==='HEAD'?undefined:data);
  });
});
server.listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log(`ISM Business English: http://127.0.0.1:${server.address().port}`));
