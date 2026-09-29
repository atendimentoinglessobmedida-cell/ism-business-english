import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
function run(args){const result=spawnSync(process.execPath,args,{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1)}
for(const dir of ['.','scripts'])for(const file of fs.readdirSync(dir).filter(f=>/\.(?:js|mjs|cjs)$/.test(f)))run(['--check',path.join(dir,file)]);
for(const file of ['published-functional-check','core-resume-contract-check','persistence-resume-check','release-e2e-contract','product-completion-check','market-benchmark-check','visual-learning-check'])run([`scripts/${file}.mjs`]);
for(const file of ['premium-check','premium-progress-check','authentic-listening-check','regional-audio-check'])run([`.ci/${file}.cjs`]);
run(['scripts/access-session-check.mjs']);
run(['scripts/pedagogy-content-check.mjs']);
run(['scripts/legacy-access-rollout-check.mjs']);
run(['scripts/build-static.mjs']);
console.log('All static QA checks passed.');
