import { Resolver, Query, Arg, Ctx, FieldResolver, Root } from "type-graphql";
import { Users } from "../models/user";
import { MongoService } from "../service/MongoService";
import { getModelForClass } from "@typegoose/typegoose";
import { S3Service } from "../service/S3Service";
import { Posts } from "../models/post";

@Resolver(Users)
export class UserResolver {
  private mongoService: MongoService;
  private userModel: any;
  private s3Service: S3Service;
  private postModel: any;

  constructor() {
    this.mongoService = new MongoService();
    this.userModel = getModelForClass(Users);
    this.s3Service = new S3Service();
    this.postModel = getModelForClass(Posts);
  }

  @Query(returns => Users)
  async getUser(@Arg("email") email: string, @Arg("webid") webid: string) {
    await this.mongoService.connect();
    const dbResult: Users[] = await this.userModel.find({
      webid: webid,
      "social.email": email
    });
    if (dbResult.length > 0) return dbResult[0];
    else return {};
  }

  @Query(returns => Users)
  async user(@Ctx() ctx: any) {
    await this.mongoService.connect();
    return await this.userModel.findById(ctx.requestContext.authorizer.principalId).exec();
  }

  @FieldResolver()
  async files(@Root() user: any) {
    return await this.s3Service.getFilesList(user.id, user.webid);
  }

  @FieldResolver()
  async posts(@Root() user: any) {
    console.log(user);
    return await this.postModel.find({
      author: user.id,
      webid: user.webid
    });
  }
}
