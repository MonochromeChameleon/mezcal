const method = 'GET';
const path = '/throw-error';
const handler = () => {
  throw new Error('Oh no!');
};

export { method, path, handler };
