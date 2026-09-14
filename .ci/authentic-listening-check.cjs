const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');process.chdir(path.join(__dirname,'..'));
const ctx={window:{}};vm.createContext(ctx);for(const file of ['premium-courses.js','premium-special.js','premium-engine.js','premium-authentic-listening.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
const A=ctx.window.ISMAuthenticListening,E=ctx.window.ISMPremiumEngine;
assert.equal(A.render(0,''),'');assert.equal(A.render(3,''),'');
for(const i of [1,2]){const html=A.render(i,'<script>alert(1)</script>');assert(!html.includes('<iframe'));assert(html.includes('&lt;script&gt;'));assert(html.includes('youtube.com/watch'));assert.equal((html.match(/name="authentic-answer"/g)||[]).length,3);assert(A.check(i,null).startsWith('Escolha'));assert(A.check(i,i===1?'0':'1').startsWith('✓'));assert(A.check(i,'2').startsWith('Ouça novamente'));}
const s=E.record({done:true,authenticNotes:'Minute 03:20. My question.'});assert.equal(s.authenticNotes,'Minute 03:20. My question.');assert.equal(E.record(s).done,true);assert.equal(E.record({authenticNotes:{}}).authenticNotes,'');assert.notEqual(E.key('P9'),E.key('P1'));
for(const f of ['premium-study.js','premium-authentic-listening.js'])new vm.Script(fs.readFileSync(f,'utf8'));
assert(fs.readFileSync('premium.html','utf8').indexOf('premium-authentic-listening.js')<fs.readFileSync('premium.html','utf8').indexOf('premium-study.js'));
console.log('PASS: two recordings, optional scope, deferred external player, escaped notes, exercise feedback, note persistence and existing completion');
