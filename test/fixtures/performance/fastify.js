import fastify from 'fastify';

const fs = fastify();

const schema = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          hello: {
            type: 'string',
          },
        },
      },
    },
  },
};

fs.get('/', schema, (req, reply) => reply.send({ hello: 'world' }));

export const server = {
  listen(port) {
    fs.listen(port);
    return fs;
  },
};
