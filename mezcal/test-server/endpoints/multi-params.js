const method = 'ALL';
const path = '/hello/:something/:very/:silly/yes';
const handler = ctx => `${ctx.pathParams.something} ${ctx.pathParams.very} ${ctx.pathParams.silly}`;

export { method, path, handler };
