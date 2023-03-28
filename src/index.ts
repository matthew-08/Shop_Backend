import { createYoga } from 'graphql-yoga';
import { createServer } from 'http';

const yoga = createYoga({
  graphqlEndpoint: '/',
  schema: {},
  context: (req) => req,
});

const server = createServer(yoga);

server.listen(4000);
