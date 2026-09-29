import fs from 'node:fs';
const read=f=>fs.readFileSync(f,'utf8');let bad=false;const ok=(v,m)=>{console.log(`${v?'PASS':'FAIL'}: ${m}`);if(!v)bad=true};
const exp=read('experience.js'),js=read('visual-learning.js'),css=read('visual-learning.css');
const assets=['assets/visual-meetings.svg','assets/visual-presentations.svg','assets/visual-negotiation.svg','assets/visual-client-call.svg'];
ok(/visual-learning\.css/.test(exp)&&/visual-learning\.js/.test(exp),'visual learning module is loaded');
for(const a of assets){ok(fs.existsSync(a)&&fs.statSync(a).size>500,`${a} exists and is non-empty`);ok(fs.statSync(a).size<15000,`${a} fits the lightweight visual budget`);ok(!/<script|<foreignObject|https?:\/\/(?!www.w3.org)/i.test(read(a)),`${a} is self-contained`);}
ok(assets.reduce((n,a)=>n+fs.statSync(a).size,0)<60000,'visual family below 60 KB');
ok(/Meetings/.test(js)&&/Presentations/.test(js)&&/Negotiations/.test(js)&&/Client calls/.test(js),'home covers four professional visual contexts');
ok(/lesson-visual/.test(js)&&/figcaption/.test(js),'lesson visuals provide contextual pedagogical captions');
ok(/businessmode-visual/.test(js),'Business Mode receives contextual imagery');
ok(/loading="lazy"/.test(js),'non-critical imagery uses lazy loading');
ok(/focus-visible/.test(css)&&/prefers-reduced-motion/.test(css),'visual system protects focus and reduced motion');
ok(/max-width:720px/.test(css)&&/max-width:360px/.test(css),'visual system has mobile breakpoints');
if(bad)process.exit(1);console.log('\nVisual learning contracts ok');