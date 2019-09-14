import "reflect-metadata";
import { ApolloServer } from "apollo-server-lambda";
import { buildSchemaSync } from "type-graphql";
import { PostResolver } from "./graphql/postResolver";

console.log(`GLOBAL: ${JSON.stringify((<any>global).cachedSchema)}`);
(<any>global).cachedSchema =
    (<any>global).cachedSchema ||
    buildSchemaSync({
        resolvers: [ PostResolver ]
    });

const schema = (<any>global).cachedSchema;

const server = new ApolloServer({ schema });
exports.graphqlHandler = server.createHandler();