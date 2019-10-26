import { Users, Social } from "../models/user";

export class BaseResolver {
  protected getCtx = (ctx: any): { user: Users; webid: string } => {
    let user = new Users();
    if (ctx && ctx.requestContext && ctx.requestContext.authorizer) {
      let ctxUser = ctx.requestContext.authorizer;
      user.id = ctxUser.user_id;
      let social = new Social();
      social.email = ctxUser.email;
      user.social = [social];
    }

    let webid = "unknown";
    switch (ctx.headers.Origin) {
      case "http://localhost:4200":
      case "http://www-dev.aws.roorkee.org":
        webid = "rke-dev";
        break;
      case "http://www.aws.roorkee.org":
        webid = "rke-prod";
        break;
      default:
        console.log(`Unknown origin ${ctx.headers.Origin}`);
    }
    return { user: user, webid: webid };
  };
}
