// Builds src/assets/images from the Claude Design handoff bundle (../project/assets/images).
// Photos (PNG) → WebP at source size plus a 720px variant for phones; already-WebP files are
// copied as-is; client logos stay PNG (tiny, need alpha); logo.svg is copied without the
// embedded C2PA manifest. Run: npm run images
import { mkdir, readdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { join, extname, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, '..', '..', 'project', 'assets', 'images');
const OUT = join(here, '..', 'src', 'assets', 'images');

const PHOTO_DIRS = ['backgrounds', 'process'];
const COPY_DIRS = ['portfolio', 'team', 'clients'];
const SMALL_W = 720;
const QUALITY = 80;

async function photos(dir) {
  await mkdir(join(OUT, dir), { recursive: true });
  for (const f of await readdir(join(SRC, dir))) {
    if (extname(f) !== '.png') continue;
    const name = basename(f, '.png');
    const input = sharp(join(SRC, dir, f));
    const { width } = await input.metadata();
    await input.clone().webp({ quality: QUALITY }).toFile(join(OUT, dir, `${name}.webp`));
    if (width > SMALL_W) {
      await input.clone().resize({ width: SMALL_W }).webp({ quality: QUALITY }).toFile(join(OUT, dir, `${name}-720.webp`));
    }
    console.log(`${dir}/${name}: png → webp (${width}px, ${SMALL_W}px)`);
  }
}

async function copy(dir) {
  await mkdir(join(OUT, dir), { recursive: true });
  for (const f of await readdir(join(SRC, dir))) {
    if (f === 'team-roman-hero.webp') continue; // not referenced by the design
    await copyFile(join(SRC, dir, f), join(OUT, dir, f));
  }
  console.log(`${dir}: copied`);
}

async function logo() {
  const svg = await readFile(join(SRC, 'logo.svg'), 'utf8');
  await writeFile(join(OUT, 'logo.svg'), svg.replace(/<metadata>[\s\S]*?<\/metadata>/, '').replace(/\s+xmlns:c2pa="[^"]*"/, ''));
  console.log('logo.svg: metadata stripped');
}

await mkdir(OUT, { recursive: true });
for (const d of PHOTO_DIRS) await photos(d);
for (const d of COPY_DIRS) await copy(d);
await logo();
