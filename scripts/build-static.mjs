import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// This branch ships the static/PWA app. Its historical Next.js package metadata
// must not select a Next build or publish repository/internal files as assets.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
if (path.relative(root, output) !== 'dist') throw new Error('Unsafe output directory');
if (fs.existsSync(output)) {
  if (fs.lstatSync(output).isSymbolicLink()) throw new Error('Output must not be a symlink');
  fs.rmSync(output, { recursive: true });
}
fs.mkdirSync(output);
const extensions = new Set(['.html', '.css', '.js', '.webmanifest']);
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.isFile() && extensions.has(path.extname(entry.name))) {
    fs.copyFileSync(path.join(root, entry.name), path.join(output, entry.name));
  }
}
fs.cpSync(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
const missing = [];
for (const name of fs.readdirSync(output).filter(name => name.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(output, name), 'utf8');
  for (const [, ref] of html.matchAll(/(?:src|href)=["']([^"'#?]+)/g)) {
    if (/^(?:[a-z]+:|\/\/)/i.test(ref)) continue;
    if (!fs.existsSync(path.resolve(output, ref))) missing.push(`${name}: ${ref}`);
  }
}
const worker = fs.readFileSync(path.join(output, 'sw.js'), 'utf8');
const shell = worker.match(/const SHELL=\[([^\]]+)\]/)?.[1];
if (!shell) throw new Error('Missing PWA shell inventory');
for (const [, ref] of shell.matchAll(/'([^']+)'/g)) {
  if (!fs.existsSync(path.resolve(output, ref))) missing.push(`sw.js: ${ref}`);
}
JSON.parse(fs.readFileSync(path.join(output, 'manifest.webmanifest'), 'utf8'));
if (missing.length) throw new Error(`Missing published assets:\n${missing.join('\n')}`);
if (['package.json', '.git', 'supabase', 'scripts'].some(name => fs.existsSync(path.join(output, name)))) {
  throw new Error('Internal repository files leaked into static output');
}
console.log(`Static/PWA build passed: ${fs.readdirSync(output).length} root entries, HTML references and offline shell verified.`);
