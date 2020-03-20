export const DefaultHeadersPlugin = {
  DefaultHeaders({ Context }, opts = {}) {
    Context.onCreate(ctx => Object.keys(opts).forEach(k => ctx.res.setHeader(k, opts[k])));
  },
};
