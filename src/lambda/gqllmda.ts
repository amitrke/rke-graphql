import { APIGatewayEvent } from "aws-lambda";
import { GraphQLSchema, graphql } from "graphql";
import { buildSchemaSync } from "type-graphql";
import { PostResolver } from "../graphql/postResolver";
import { UserResolver } from "../graphql/userResolver";
import { FileResolver } from "../graphql/fileResolver";
import { HttpResp } from "../common/httpresp";

export class GqlLambda {

    private schema: GraphQLSchema;

    public handler = async (event: APIGatewayEvent) => {
        console.log(JSON.stringify(event));
        if (!this.schema){
            (<any>global).cachedSchema =
                (<any>global).cachedSchema ||
                buildSchemaSync({
                    resolvers: [ PostResolver, UserResolver, FileResolver ]
                });
            this.schema = (<any>global).cachedSchema;
        }

        if (event.httpMethod === "POST" && event.body){
            const requestBody = JSON.parse(event.body);
            try {
                const resp = await graphql(
                    this.schema, requestBody.query, undefined, null, requestBody.variables, requestBody.operationName
                );
                return HttpResp.buildResp(resp, 200);
            } catch (err) {
                console.error(JSON.stringify(err));
                return HttpResp.buildResp(err, 500);
            }
        } else {
            return HttpResp.buildResp({message: "Only POST method is supported"}, 400);
        }
    }
}