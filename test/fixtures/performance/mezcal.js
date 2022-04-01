import { Mezcal } from '../../../mezcal/core/mezcal.js';

const mz = new Mezcal();

function handler() {
  return '{ "hello": "world" }';
}

mz.use({
  path: '/',
  method: 'GET',
  handler,
});

export const server = mz;
