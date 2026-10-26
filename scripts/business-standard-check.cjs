const fs=require('fs'),assert=require('node:assert/strict');
const pages=fs.readdirSync('.').filter(x=>x.endsWith('.html'));
for(const page of pages){const html=fs.readFileSync(page,'utf8');assert.ok(html.includes('data-ism-page="'+page.replace('.html','')+'"'),page+' identity');const head=html.split('</head>')[0],styles=[...head.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(x=>x[1]);assert.match(styles.at(-1),/^business-standard\.css\?v=\d+$/,page+' final theme');assert.ok(head.includes('content="#205ec5"'),page+' browser theme');assert.ok(styles.some(x=>x.startsWith('button-system.css')),page+' shared touch and focus controls');}
assert.ok(fs.readFileSync('sw.js','utf8').includes('./business-standard.css'));
console.log(pages.length+' Business pages share final theme, page identity, button geometry and browser color; offline shell includes the theme.');
