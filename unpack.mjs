// Rebuild one chunk folder from a topic pack.
//   node unpack.mjs <pack dir> <chunk> <out dir>
// The pack keeps every asset once (shared/), plus per chunk the HTML files and a list of the assets it uses.
// Voice files are not shipped (the final audio is added later on the laptop): each one becomes silence of the same
// length, so the composition still finds every file it expects.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const [pack, r, out] = process.argv.slice(2);
if (!/^[0-9]+-[0-9]+$/.test(r)) throw new Error('bad chunk name');
const src = path.join(pack, 'chunks', r);
fs.cpSync(src, out, { recursive: true });
const m = JSON.parse(fs.readFileSync(path.join(src, 'files.json'), 'utf8'));
const inside = (base, rel) => {
  const p = path.resolve(base, rel);
  if (!p.startsWith(path.resolve(base) + path.sep)) throw new Error(`bad path ${rel}`);
  return p;
};
for (const rel of m.files) {
  const to = inside(out, rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(inside(path.join(pack, 'shared'), rel), to);
}
for (const [rel, dur] of Object.entries(m.silence)) {
  const to = inside(out, rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', String(Number(dur) || 1), to]);
}
fs.rmSync(path.join(out, 'files.json'));
console.log(`chunk ${r}: ${m.files.length} files, ${Object.keys(m.silence).length} silent voice files`);
