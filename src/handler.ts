import "reflect-metadata";
import { OptLmda } from "./lambda/optlmda";
import { GqlLambda } from "./lambda/gqllmda";
import { AuthLmda } from "./lambda/authlmda";

const optLmda = new OptLmda();
const gqlLmda = new GqlLambda();
const authLmda = new AuthLmda();

exports.optionsHandler = optLmda.handler;
exports.gqlHandler = gqlLmda.handler;
exports.authHandler = authLmda.handler;