import fs from 'fs';
import path from 'path';

import { zip } from './zip.js';

export async function readdir(dir) {
  const members = await fs.promises
    .stat(dir)
    .then(stat => (stat.isFile() ? [dir] : fs.promises.readdir(dir).then(d => d.map(m => path.join(dir, m)))))
    .catch(() => []);

  const fileFlags = await Promise.all(members.map(async it => (await fs.promises.stat(it)).isFile()));
  const dirFlags = await Promise.all(members.map(async it => (await fs.promises.stat(it)).isDirectory()));

  const files = zip(members, fileFlags)
    .filter(({ second }) => second)
    .map(({ first }) => first);
  const dirs = zip(members, dirFlags)
    .filter(({ second }) => second)
    .map(({ first }) => first);

  const rec = (await Promise.all(dirs.map(readdir))).flat();
  return [...files, ...rec];
}
