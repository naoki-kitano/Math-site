// Copies only site sources and validation files into the dedicated checkout.
// No git commit, push, visibility change or deployment is performed here.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve('.');
const destination=path.resolve('work/github-pages-source');
if(!destination.startsWith(root+path.sep))throw Error('Unexpected destination');
const files=['app','tests','scripts','public'].flatMap(dir=>fs.readdirSync(dir,{recursive:true}).filter(f=>fs.statSync(path.join(dir,f)).isFile()).map(f=>dir+'/'+f.replaceAll('\\','/')));
files.push('package.json','pnpm-lock.yaml','next.config.ts','vite.config.ts','tsconfig.json','eslint.config.mjs','postcss.config.mjs','AGENTS.md','MATHCANVAS_QA.md','GITHUB_PAGES.md','PREREQUISITE_SYSTEM.md','REVIEW_SYSTEM_DESIGN.md','JUNIOR_DESIGN.md','MATH1_DESIGN.md','MATHA_DESIGN.md','MATHA_CH1.md','MATHA_CH2.md','MATHA_CH3.md','MATHA_CH4.md','MATHA_CH5.md','MATHA_REVIEW.md','MATHB_DESIGN.md','MATHC_DESIGN.md');
files.push('CLARITY_REVIEW.md','SEVEN_SUBJECT_REVIEW.md','EDITORIAL_PRINCIPLES.md','EDITORIAL_CHECKPOINT.md','EDITORIAL_JUNIOR_CHECKPOINT.md','EDITORIAL_MATHI_CHECKPOINT.md','EDITORIAL_MATHA_CHECKPOINT.md','EDITORIAL_COVERAGE.json');
const changes=[];
for(const file of files){
 const source=fs.readFileSync(file);
 const target=path.join(destination,file);
 if(fs.existsSync(target)&&source.equals(fs.readFileSync(target)))continue;
 changes.push({path:file,bytes:source.length,sha256:createHash('sha256').update(source).digest('hex')});
 if(process.argv.includes('--apply')){fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);}
}
console.log(JSON.stringify(changes,null,2));
