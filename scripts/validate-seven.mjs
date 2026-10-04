import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const output='outputs/seven-subjects';
mkdirSync(output,{recursive:true});
const p=JSON.parse(readFileSync('package.json','utf8'));
const commands=[
 ['tests',p.scripts.test.replace(/^node /,'').split(' ')],
 ['types',['node_modules/typescript/bin/tsc','--noEmit']],
 ['lint',['node_modules/eslint/bin/eslint.js','.','--ignore-pattern','dist','--ignore-pattern','.next']],
 ['prerequisites',['scripts/audit-prerequisites.mjs']],
 ['build',['node_modules/vinext/dist/cli.js','build']],
];
for(const [name,args] of commands){
 console.log('Starting '+name);
 const result=spawnSync(process.execPath,args,{encoding:'utf8',env:{...process.env,PATH:process.execPath.replace(/[^\\/]+$/,'')+';'+process.env.PATH},maxBuffer:20*1024*1024});
 writeFileSync(output+'/'+name+'.log',result.stdout+result.stderr);
 console.log(name+': '+result.status);
 if(result.status!==0){console.error((result.stdout+result.stderr).slice(-5000));process.exit(1);}
}
