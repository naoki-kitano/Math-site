import {spawnSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
const env={...process.env,MATHCANVAS_STATIC:'1',MATHCANVAS_CHECK_URL:'http://127.0.0.1:3013/Math-site',MATHCANVAS_SCAN_EXPORT:'1'};
for(const script of ['check-concept-explorers','check-math-motion','check-math-rendering','check-deep-review']){
 console.log('Starting static '+script);
 const r=spawnSync(process.execPath,['scripts/'+script+'.mjs'],{encoding:'utf8',env,maxBuffer:20*1024*1024});
 writeFileSync('outputs/seven-subjects/'+script+'-static.log',r.stdout+r.stderr);
 console.log(script+': '+r.status);
 if(r.status!==0){console.error((r.stdout+r.stderr).slice(-4000));process.exit(1);}
}
