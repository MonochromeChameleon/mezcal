import { defineCachedProperty } from '@mezcal/utils';
import { HttpError } from '@mezcal/errors';

const onCreate = Symbol('onCreate');

export const CoreContextPlugin = {
  Create({ Context }) {
    Object.defineProperty(Context, 'create', {
      async value(req, res) {
        const ctx = new Context(req, res);
        return Promise.all((Context[onCreate] || []).map(p => p(ctx))).then(() => ctx);
      },
    });
  },
  Error({ Context }) {
    Object.defineProperty(Context.prototype, 'error', {
      value(e) {
        if (this.res.headersSent || !e) return;

        if (e instanceof HttpError) {
          this.res.writeHead(e.code, { 'Content-Type': 'text/plain' });
          this.res.write(e.message);
        } else {
          this.res.writeHead(500, { 'Content-Type': 'text/plain' });
          this.res.write('Server Error');
        }
        this.res.end();
      },
    });
  },
  OnCreate({ Context }) {
    Object.defineProperty(Context, 'onCreate', {
      value(p) {
        this[onCreate] = this[onCreate] || [];
        this[onCreate].push(p);
      },
    });
  },
  Result({ Context }) {
    Object.defineProperty(Context.prototype, 'result', {
      set(value) {
        if (this.res.headersSent) return;

        if (value instanceof Object) {
          this.res.writeHead(200, { 'Content-Type': 'application/json' });
          this.res.write(JSON.stringify(value));
        } else {
          this.res.writeHead(200, { 'Content-Type': 'text/plain' });
          this.res.write(value);
        }
        this.res.end();
      },
    });
  },
  Url({ Context }) {
    defineCachedProperty(Context.prototype, 'url', function url() {
      return new URL(this.req.url, 'http://localhost');
    });
  },
};
