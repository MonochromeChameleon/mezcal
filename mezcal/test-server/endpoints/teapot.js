import { ImATeapotError } from '@mezcal/errors';

const method = 'GET';
const path = '/make-drink/:drink';
const handler = ctx => {
  switch (ctx.pathParams.drink.toLowerCase()) {
    case 'tea':
      return 'How about a nice cuppa?';
    case 'coffee':
      throw new ImATeapotError();
    default:
      return 'Please try a different drink';
  }
};

export { method, path, handler };
