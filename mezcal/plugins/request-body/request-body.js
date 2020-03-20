import { defineCachedProperty } from '@mezcal/utils';

export const RequestBodyPlugin = {
  OnCreateRequestBody({ Context }) {
    Context.onCreate(
      ctx =>
        new Promise(resolve => {
          if (!['POST', 'PUT', 'PATCH'].includes(ctx.req.method)) {
            resolve();
          } else {
            ctx.data = [];
            ctx.req.on('data', ctx.data.push.bind(ctx.data));
            ctx.req.on('end', resolve);
          }
        })
    );
  },
  RequestBody({ Context }) {
    defineCachedProperty(Context.prototype, 'body', function requestBody() {
      return JSON.parse(this.data);
    });
  },
};
