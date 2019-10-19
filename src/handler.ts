import "reflect-metadata";
import { OptLmda } from "./lambda/optlmda";
import { GqlLambda } from "./lambda/gqllmda";

const optLmda = new OptLmda();
const gqlLmda = new GqlLambda();

exports.optionsHandler = optLmda.handler;
exports.gqlHandler = gqlLmda.handler;
