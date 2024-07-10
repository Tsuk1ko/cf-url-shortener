import { readdir } from 'fs/promises';
import { resolve } from 'path';

const entrypoints = (await readdir(resolve(import.meta.dir, 'functions')))
  .filter(x => x.endsWith('.ts'))
  .map(x => resolve(import.meta.dir, 'functions', x));

await Bun.build({
  entrypoints,
  outdir: './functions',
});
