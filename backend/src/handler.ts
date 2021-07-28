import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-lambda";
import { createInstance, prepareResolvers } from "subscriptionless";
import { typeDefs, resolvers } from "./schema";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: prepareResolvers(resolvers),
});

export const websocket = createInstance({ schema }).gatewayHandler;

export const http = new ApolloServer({ schema }).createHandler({
  cors: {
    origin: "*",
    allowedHeaders: "*",
    credentials: true,
  },
} as any);
