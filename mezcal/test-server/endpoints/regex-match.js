const method = 'GET';
const path = '/hello-regex/:times(\\d+)';
const handler = ctx => {
  const times = Number(ctx.pathParams.times);
  return Array.from({ length: times })
    .map(() => 'Hello')
    .join(' ');
};

export { method, path, handler };
