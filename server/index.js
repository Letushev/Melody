const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');
const Mutation = require('./resolvers/Mutation');

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers: {
    Mutation,
    Query: {
      test: () => 'test'
    }
  },
  context: request => {
    return {
      ...request,
      prisma,
    }
  },
});

server.start(() => console.log(`Server is running on http://localhost:4000`));