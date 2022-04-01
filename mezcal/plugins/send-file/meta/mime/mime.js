import https from 'https';
import fs from 'fs';
import path from 'path';

import * as apache from './apache.js';
import * as nginx from './nginx.js';

const parsers = [apache, nginx];

const downloadAndParse = parser =>
  new Promise(resolve => {
    https.get(parser.source, resp => {
      let data = '';

      resp.on('data', chunk => {
        data += chunk;
      });

      resp.on('end', () => {
        resolve(parser.parser(data));
      });
    });
  });

const downloadAndParseAll = async () => {
  const results = await Promise.all(parsers.map(downloadAndParse));

  return results.flat().reduce((sofar, def) => {
    def.extensions.forEach(ext => {
      if (!sofar[ext]) {
        sofar[ext] = def.mime;
      }
      return sofar;
    });

    return sofar;
  }, {});
};

export const process = async () => {
  const mimes = await downloadAndParseAll();
  const tmpPath = path.resolve('.tmp');
  await fs.promises.stat(tmpPath).catch(() => fs.promises.mkdir(tmpPath));
  return fs.promises.writeFile(path.resolve('.tmp/meta.js'), `export default ${JSON.stringify(mimes, undefined, 2)}`);
};
