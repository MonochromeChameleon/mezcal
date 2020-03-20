const method = 'ALL';
const path = '/hello/:something/quite/:silly/yes';
const handler = ctx => `${ctx.pathParams.something} ${ctx.pathParams.silly}`;

export { method, path, handler };
