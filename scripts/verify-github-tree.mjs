import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const tree=process.argv[2];
assert(/^[a-f0-9]{40}$/.test(tree));
const response=await fetch(`https://api.github.com/repos/naoki-kitano/Math-site/git/trees/${tree}?recursive=1`);
assert.equal(response.status,200);
const data=await response.json();assert(!data.truncated);
const files=JSON.parse(fs.readFileSync('outputs/notation/release-files.json','utf8'));
for(const file of files){
 const bytes=fs.readFileSync('work/github-pages-source/'+file.path);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256,file.path+' changed since validation');
 const sha=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
 assert.equal(data.tree.find(e=>e.path===file.path)?.sha,sha,file.path+' remote mismatch');
}
console.log(`Verified ${files.length} remote blobs byte-for-byte against validated local sources.`);
