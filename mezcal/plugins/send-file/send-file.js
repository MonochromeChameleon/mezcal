import fs from 'fs';
import path from 'path';

import mime from './.tmp/meta.js';

export const SendFilePlugin = {
  SendFile({ Context }) {
    Object.defineProperty(Context.prototype, 'sendFile', {
      async value(file) {
        const stat = await fs.promises.stat(file);

        this.res.writeHead(200, {
          'Content-Type': mime[path.extname(file).slice(1)],
          'Content-Length': stat.size,
        });

        const readStream = fs.createReadStream(file);
        readStream.pipe(this.res);
      },
    });
  },
};
