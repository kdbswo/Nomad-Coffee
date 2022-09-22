import "dotenv/config";
import express from "express";
import loogger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUsers } from "./users/users.utils";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const PORT = process.env.PORT;

const startServer = async () => {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: async ({ req }) => {
      return {
        loggedInUser: await getUsers(req.headers.token),
      };
    },
  });
  await apollo.start();
  const app = express();

  app.use(loogger("tiny"));
  app.use("/static", express.static("uploads"));
  app.use(graphqlUploadExpress());
  apollo.applyMiddleware({ app });

  await new Promise((func) => app.listen({ port: PORT }, func));
  console.log(`🚀 Server: http://localhost:${PORT}${apollo.graphqlPath}`);
};

startServer();
