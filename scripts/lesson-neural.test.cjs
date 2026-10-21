const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const context={window:{}};
for(const file of ['business-practice-content.js','business-reference-content.js','business-neural-data.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
test('all fifteen public lessons have twelve exact, playable neural dialogue assets',()=>{
 const speakers=new Map();let total=0;
 for(const lesson of context.window.ISM_BUSINESS_PRACTICE){
  const clips=context.window.ISM_BUSINESS_NEURAL[lesson.id];assert.equal(clips.length,lesson.dialogue.length);
  clips.forEach((clip,i)=>{assert.equal(clip.speaker,lesson.dialogue[i][0]);assert.equal(clip.text,lesson.dialogue[i][1]);assert.match(clip.audioUrl,/^assets\/dialogues\/[a-z0-9-]+\.mp3$/);const bytes=fs.readFileSync(clip.audioUrl);assert.equal(bytes.length,clip.bytes);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),clip.sha256);assert.ok(clip.seconds>0.5);if(speakers.has(clip.speaker))assert.equal(speakers.get(clip.speaker),clip.voice);speakers.set(clip.speaker,clip.voice);total++;});
 }
 assert.equal(total,180);assert.equal(new Set(speakers.values()).size,speakers.size);
});
test('the practice page loads the asset catalogue before wiring playback',()=>{
 const html=fs.readFileSync('business-practice.html','utf8');assert.ok(html.indexOf('business-neural-data.js')<html.indexOf('src="business-practice.js"'));
 const source=fs.readFileSync('business-practice.js','utf8');assert.ok(source.includes('turn.speaker===speaker&&turn.text===text'));assert.ok(source.includes('áudios neurais pré-gerados'));
});
