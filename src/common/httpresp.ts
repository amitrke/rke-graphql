import { APIGatewayProxyResult } from "aws-lambda";

export class HttpResp {
    public static buildResp = (body: any, statusCd: number): APIGatewayProxyResult => {
        return {
            statusCode: statusCd,
            headers: {
                "access-control-allow-headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,webid",
                "access-control-allow-methods": "OPTIONS,GET,POST",
                "access-control-allow-origin": "*",
                "access-control-allow-credentials": "false"
            },
            body: JSON.stringify(body)
          };
    }
}