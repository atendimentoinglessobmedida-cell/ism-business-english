import fs from 'node:fs';
import assert from 'node:assert/strict';
const index=fs.readFileSync('index.html','utf8');
const academy=fs.readFileSync('level-pathways.html','utf8');
const script=fs.readFileSync('level-pathways.js','utf8');
for(const kind of ['meeting','interview','presentation']) {
  assert(index.includes('href="level-pathways.html?kind='+kind+'"'), 'Missing contextual navigation: '+kind);
}
assert(script.includes("new URLSearchParams(location.search).get('kind')"),'Academy must honor contextual navigation');
assert(script.includes('kinds.includes(kind)'), 'Academy must validate the selected scenario');
for(const [file,html] of [['index.html',index],['level-pathways.html',academy]]) {
  const images=[...html.matchAll(/<img\\b[^>]*\\bsrc="(assets\\/[^"]+)"/g)].map(m=>m[1]);
  for(const src of images) assert(fs.existsSync(src), file+' references missing image: '+src);
  assert(images.length>=3,file+' should contain at least three images');
  console.log(file+': '+images.length+' local images verified');
}
for(const css of ['editorial-refresh.css','academy-refresh.css'])assert(fs.existsSync(css),'Missing design stylesheet: '+css);
console.log('Editorial navigation and image references passed. Browser QA still required.');
