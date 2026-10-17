// Small static server for local development; no dependencies required.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
const root=process.cwd(),types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.md':'text/markdown; charset=utf-8'};
createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=resolve(root,`.${pathname==='/'?'/index.html':pathname}`);if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end('Forbidden');return}const body=await readFile(file);res.writeHead(200,{'content-type':types[extname(file)]||'application/octet-stream'}).end(body)}catch{res.writeHead(404,{'content-type':'text/plain; charset=utf-8'}).end('Not found')}}).listen(8000,()=>console.log('IRON PULSE em http://localhost:8000'));
