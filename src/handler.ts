import "reflect-metadata";
import { ApolloServer } from "apollo-server-lambda";
import { buildSchemaSync } from "type-graphql";
import { PostResolver } from "./graphql/postResolver";
import { UserResolver } from "./graphql/userResolver";
import { FileResolver } from "./graphql/fileResolver";
import { Context, Callback } from "aws-lambda";

console.log(`GLOBAL: ${JSON.stringify((<any>global).cachedSchema)}`);
(<any>global).cachedSchema =
    (<any>global).cachedSchema ||
    buildSchemaSync({
        resolvers: [ PostResolver, UserResolver, FileResolver ]
    });

const schema = (<any>global).cachedSchema;

const server = new ApolloServer({ 
    schema,
    context: ({ event, req }) => {
        const context = {
            event: event,
            req: req
        };
        return context;
      }
});
exports.graphqlHandler = server.createHandler(
    {
        cors: {
            origin: "*",
            methods: "OPTIONS,GET,POST",
            allowedHeaders: "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent"
        }
    }
);

exports.optionsHandler = (event: any, context: Context, callback: Callback) => {
    const response = {
        statusCode: 200,
        headers: {
            "access-control-allow-headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
            "access-control-allow-methods": "OPTIONS,GET,POST",
            "access-control-allow-origin": "*",
            "access-control-allow-credentials": "false"
        },
        body: JSON.stringify({
          message: Math.floor(Math.random() * 10)
        })
      };
    callback(undefined, response);
}
