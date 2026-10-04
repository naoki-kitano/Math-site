import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {contentModule} from './content-module.mjs';
const original='C:/Users/naoch/Documents/Codex/2026-08-14/chatgpt-codex-chatgpt-chatgpt-chat-work-2';
const roots=[original,original+'/work/github-pages-source',process.cwd()];
const records=[];
for(const root of roots){
 const {lessons,exercises}=await import(contentModule(pathToFileURL(resolve(root,'app/content/lessons.ts'))));
 const {subjectForChapter}=await import(contentModule(pathToFileURL(resolve(root,'app/content/chapters.ts'))));
 const counts={};
 for(const l of lessons)counts[subjectForChapter(l.chapter)]=(counts[subjectForChapter(l.chapter)]??0)+1;
 const git=args=>spawnSync('git',['-c','safe.directory='+root,'-C',root,...args],{encoding:'utf8'}).stdout.trim();
 records.push({root,counts,lessons:lessons.length,examples:lessons.reduce((s,l)=>s+l.examples.length,0),exercises:exercises.length,chaptersSHA256:createHash('sha256').update(readFileSync(resolve(root,'app/content/chapters.ts'))).digest('hex'),head:git(['log','-1','--format=%H %cI %s']),status:git(['status','--porcelain=v1','-uall']),remote:git(['remote','-v'])});
}
writeFileSync('outputs/seven-subjects/site-identity.json',JSON.stringify(records,null,2));
console.log(JSON.stringify(records.map(({status,...r})=>({...r,statusLines:status?status.split('\n').length:0})),null,2));
