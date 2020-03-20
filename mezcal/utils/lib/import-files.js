import path from 'path';

import { readdir } from './reeaddir';

export async function importFiles(dir) {
  if (typeof dir === 'string') {
    return Promise.all((await readdir(path.resolve(dir))).map(it => import(it)));
  }
  return dir;
}
