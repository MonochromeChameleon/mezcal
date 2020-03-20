import fs from 'fs';
import http from 'http';
import path from 'path';

const cleanMessage = message =>
  message
    .split(' ')
    .map(word => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ');

const template = (code, message) => `import { HttpError } from '../lib/http-error';

export class ${cleanMessage(message).replace(/[^\w]/g, '')}Error extends HttpError {
  constructor() {
    super(${code}, '${message.replace(/'/, "\\'")}');
  }
}
`;

const details = Object.keys(http.STATUS_CODES)
  .map(Number)
  .filter(it => it >= 400)
  .map(code => {
    const message = http.STATUS_CODES[code];
    const filename = `${code}-${cleanMessage(message).toLowerCase().replace(/[^\w]/g, '-')}.js`;
    const outputPath = path.resolve('./.tmp', filename);

    return {
      code,
      message,
      filename,
      outputPath,
    };
  });

details
  .reduce((p, { code, message, outputPath }) => {
    const content = template(code, message);

    return p.then(() => fs.promises.writeFile(outputPath, content));
  }, Promise.resolve())
  .then(() => {
    const exportContent = details.map(({ filename }) => `export * from './${filename}'`).join('\n');
    return fs.promises.writeFile(path.resolve('./.tmp/errors.js'), exportContent);
  });
