import { APIGatewayEvent } from "aws-lambda";
import { GraphQLSchema, graphql } from "graphql";
import { HttpResp } from "../common/httpresp";

export class GqlLambda {
  private schema: GraphQLSchema;

  constructor(schema: GraphQLSchema) {
    this.schema = schema;
  }

  public handler = async (event: APIGatewayEvent) => {
    // console.log(JSON.stringify(event));

    if (event.httpMethod === "POST" && event.body) {
      const requestBody = JSON.parse(event.body);
      try {
        const resp = await graphql(
          this.schema,
          requestBody.query,
          undefined,
          event,
          requestBody.variables,
          requestBody.operationName
        );
        return HttpResp.buildResp(resp, 200);
      } catch (err) {
        console.error(JSON.stringify(err));
        return HttpResp.buildResp(err, 500);
      }
    } else {
      return HttpResp.buildResp(
        { message: "Only POST method is supported" },
        400
      );
    }
  };
}
