import {loadContent} from './content-module.mjs';
import {writeFileSync,mkdirSync} from 'node:fs';
const {lessons,exercises}=await loadContent('lessons');
const {subjectForChapter}=await loadContent('chapters');
const subjects={};
for(const lesson of lessons){
 const subject=subjectForChapter(lesson.chapter);
 (subjects[subject]??={lessons:0,examples:0,exercises:0,units:[]});
 subjects[subject].lessons++;subjects[subject].examples+=lesson.examples.length;
 subjects[subject].exercises+=exercises.filter(e=>e.lesson===lesson.slug).length;
 subjects[subject].units.push({slug:lesson.slug,title:lesson.title,introduction:lesson.introduction,rule:lesson.rule,examples:lesson.examples.map(e=>({title:e.title,prompt:e.prompt,steps:e.steps}))});
}
mkdirSync('outputs/seven-subjects',{recursive:true});
writeFileSync('outputs/seven-subjects/content-audit.json',JSON.stringify(subjects,null,2));
console.log(JSON.stringify(Object.fromEntries(Object.entries(subjects).map(([k,v])=>[k,{lessons:v.lessons,examples:v.examples,exercises:v.exercises}])),null,2));
console.log(lessons.filter(l=>/conditional|arithmetic-sum|linear-equation|derivative-meaning|vector-sum/.test(l.slug)).map(l=>({slug:l.slug,title:l.title,introduction:l.introduction,examples:l.examples.slice(0,1)})));
