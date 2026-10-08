import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const dist = path.resolve('dist');
assert(fs.statSync(dist).isDirectory(), 'Build output missing');
const forbidden = ['package.json','.env','.git','supabase','scripts','.github','premium-courses.js','premium-special.js','premium-dialogues.js','premium-authentic-listening.js','premium-british-comparison.js'];
for (const name of forbidden) assert(!fs.existsSync(path.join(dist,name)), 'Private/internal artifact published: '+name);
const htmlFiles = fs.readdirSync(dist).filter(name=>name.endsWith('.html'));
assert(htmlFiles.length>0,'No HTML entry points in build');
for (const name of htmlFiles) {
  const html=fs.readFileSync(path.join(dist,name),'utf8');
  for (const asset of forbidden.filter(x=>x.startsWith('premium-')&&x.endsWith('.js'))) {
    assert(!html.includes('src="'+asset+'"') && !html.includes("src='"+asset+"'"), name+' directly loads private script '+asset);
  }
}
console.log('Published artifact check passed: '+htmlFiles.length+' HTML entries; no forbidden files. Live endpoint tests still required.');
