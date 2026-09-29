import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const names=['premium-courses.js','premium-special.js','premium-dialogues.js','premium-authentic-listening.js','premium-british-comparison.js'];
const assets=Object.fromEntries(names.map(name=>[name,fs.readFileSync(path.join(root,name),'utf8').replace(/\r\n/g,'\n')]));
fs.writeFileSync(path.join(root,'supabase/functions/ism-premium-gateway/private-assets.json'),JSON.stringify(assets));
console.log('Packaged '+names.length+' Premium content scripts for private gateway.');
