import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpResp } from "../common/httpresp";

export class OptLmda {

    public handler = (event: APIGatewayEvent): APIGatewayProxyResult => {
        return HttpResp.buildResp({message: "ok"}, 200);
    }

}