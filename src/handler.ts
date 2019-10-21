import "reflect-metadata";
import { OptLmda } from "./lambda/optlmda";
import { GqlLambda } from "./lambda/gqllmda";
import { AuthLmda } from "./lambda/authlmda";
import { PostResolver } from "./graphql/postResolver";
import { UserResolver } from "./graphql/userResolver";
import { FileResolver } from "./graphql/fileResolver";
import { buildSchemaSync } from "type-graphql";

const optLmda = new OptLmda();

(global as any).schema = (global as any).schema || buildSchemaSync({
    resolvers: [ PostResolver, UserResolver, FileResolver ],
    emitSchemaFile: true
});

const gqlLmda = new GqlLambda((global as any).schema);
const authLmda = new AuthLmda();

exports.optionsHandler = optLmda.handler;
exports.gqlHandler = gqlLmda.handler;
exports.loginHandler = authLmda.handler;
exports.authHandler = authLmda.authHandler;