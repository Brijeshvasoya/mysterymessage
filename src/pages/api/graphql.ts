import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/schemas/typeDefs";
import { resolvers } from "@/schemas/resolvers";
import dbConnect from "@/lib/dbConnect";

dbConnect();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export default startServerAndCreateNextHandler(server);