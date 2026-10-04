// Local-only preview of the validated GitHub Pages artifact. No deployment.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist/client');
const port=Number(process.env.MATHCANVAS_PREVIEW_PORT??3013);
const mount='/Math-site/';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf'};
const server=createServer(async(req,res)=>{
  try{
    const pathname=new URL(req.url,'http://localhost').pathname;
    if(pathname==='/'||pathname==='/Math-site'){
      res.writeHead(302,{Location:mount}).end();return;
    }
    if(!pathname.startsWith(mount)){res.writeHead(404).end();return;}
    const relative=decodeURIComponent(pathname.slice(mount.length))||'index.html';
    const file=path.resolve(root,relative);
    if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    const bytes=await readFile(file);
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]??'application/octet-stream','Cache-Control':'no-store'}).end(bytes);
  }catch{res.writeHead(404).end();}
});
server.listen(port,'127.0.0.1',()=>console.log(`MathCanvas local preview: http://127.0.0.1:${port}${mount}`));
