import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
export function literals(){
 const out=[];
 for(const dir of ["app/content","app/components"]){
  for(const name of fs.readdirSync(dir)){
   if(!/\.(tsx?|json)$/.test(name))continue;
   const file=path.join(dir,name),source=fs.readFileSync(file,"utf8");
   const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,file.endsWith(".tsx")?ts.ScriptKind.TSX:ts.ScriptKind.TS);
   const visit=node=>{
    if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)){
     const raw=ts.isNoSubstitutionTemplateLiteral(node)&&ts.isTaggedTemplateExpression(node.parent);
     const value=raw?source.slice(node.getStart(tree)+1,node.end-1):node.text;
     out.push({file,start:node.getStart(tree),end:node.end,value,raw,source});
    }ts.forEachChild(node,visit);
   };visit(tree);
  }
 }return out;
}
if(process.argv[1]?.endsWith("notation-inventory.mjs")){
 const values=[...new Set(literals().flatMap(a=>{
  if(a.value.includes("$"))return [...a.value.matchAll(/\$([^$]+)\$/g)].map(m=>m[1]);
  return [a.value];
 }).filter(v=>(v.includes("/")||v.includes("\\binom"))&&!/https?:|^\.\.?\/|^\/|\/learn|\/math|node_modules/.test(v)))];
 console.log(JSON.stringify(values,null,2));
}
