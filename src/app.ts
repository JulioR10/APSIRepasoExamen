import { ApolloServer } from "apollo-server-express";
import { connectDB } from "./mongo";
import { typeDefs } from "./schema";
import { Query } from "./resolvers/Querys";
import { Mutation } from "./resolvers/Mutations";
import { Subscription } from "./resolvers/Subscriptions";
import dotenv from "dotenv";
import express from "express";
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PubSub } from "graphql-subscriptions";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";

const resolvers = {
  Query,
  Mutation,
  Subscription,
};

const run = async () => {
  dotenv.config();
  const pubsub = new PubSub();
  const app = express();
  const httpServer = createServer(app);
  const schema = makeExecutableSchema({typeDefs, resolvers});

  const clientDB = await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    schema,
    context: async ({ req, res }) => {
      return {clientDB, pubsub};
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      async onConnect(connectionParams: any, webSocket: any, context: any) {
        console.log("Connected!");
        return { pubsub };
      },
      async onDisconnect() {
        console.log("Disconnected!");
      },
    },
    {
      // This is the httpServer we created in a previous step.
      server: httpServer,
      // This server is the instance returned from new ApolloServer.
      path: server.graphqlPath,
    }
  );

  const port = process.env.PORT || 5000;

  await server.start();
  server.applyMiddleware({app});
  httpServer.listen(port,() => {
    console.log("Server escuchando en el puerto: " + port);
  });
};

try {
  run();
} catch (error) {
  console.log(error);
}