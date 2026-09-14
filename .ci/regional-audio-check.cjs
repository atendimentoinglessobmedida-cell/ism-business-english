const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
process.chdir(path.join(__dirname,'..'));
const nodes={},node=id=>nodes[id]||(nodes[id]={disabled:false,textContent:'',addEventListener(){},setAttribute(){},replaceChildren(){},add(){},querySelector:node});
let voices=[],calls=[];const synth={getVoices:()=>voices,cancel(){},speak(u){calls.push(u);u.onstart();},addEventListener(){}};
const ctx={window:{speechSynthesis:synth,SpeechSynthesisUtterance:function(t){this.text=t;},addEventListener(){}},document:{createElement:()=>node('panel'),querySelector:()=>({prepend(){}}),getElementById:()=>null,querySelectorAll:()=>[],addEventListener(){}},localStorage:{getItem:()=>null},Option:function(){},setTimeout:()=>1,clearTimeout(){}};
ctx.SpeechSynthesisUtterance=ctx.window.SpeechSynthesisUtterance;vm.createContext(ctx);vm.runInContext(fs.readFileSync('audio-player.js','utf8'),ctx);const A=ctx.window.ISMAudio;
voices=[{lang:'en-US',name:'US',voiceURI:'us'},{lang:'en-IN',name:'India',voiceURI:'in'},{lang:'en-GB',name:'UK',voiceURI:'gb'},{lang:'zh-CN',name:'Mandarin',voiceURI:'zh'}];
for(const lang of ['en-IN','en-GB']){A.speak('A business example.',.72,{lang,label:lang});assert.equal(calls.at(-1).voice.lang,lang);assert.equal(calls.at(-1).rate,.72);node('#ismRepeat').onclick();assert.equal(calls.at(-1).voice.lang,lang);}
let n=calls.length;A.speak('A business example.',.95,{lang:'en-CN',label:'China'});assert.equal(calls.length,n);assert(node('#ismRepeat').disabled);
voices=[voices[0]];n=calls.length;A.speak('A business example.',.95,{lang:'en-IN',label:'India'});assert.equal(calls.length,n);A.speak('A general example.');assert.equal(calls.at(-1).voice.lang,'en-US');
new vm.Script(fs.readFileSync('premium-study.js','utf8'));console.log('PASS: regional selection, slow playback, repeat, missing voice without substitution, Mandarin excluded, generic Core playback');
