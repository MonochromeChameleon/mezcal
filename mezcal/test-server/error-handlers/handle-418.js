import { ImATeapotError } from '@mezcal/errors';

const isError = e => e instanceof ImATeapotError;

const handler = (e, ctx) => {
  ctx.error();
  ctx.error(e);
};

export { isError, handler };
