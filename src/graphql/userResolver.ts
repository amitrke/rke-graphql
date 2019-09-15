import { Resolver, Query, Arg, ArgsType, Args } from "type-graphql";
import { Users } from "../models/user";
import { MongoService } from "../service/MongoService";
import { Model } from "mongoose";

@Resolver(Users)
export class UserResolver {

    private mongoService: MongoService;
    private userModel: Model<InstanceType<Users>>;

    constructor(){
        this.mongoService = new MongoService();
        this.userModel  = new Users().getModelForClass(Users);
    }

    @Query(returns => Users)
    async getUser(@Arg("email") email: string, @Arg("webid") webid: string) {
        await this.mongoService.connect();
        const dbResult:Users[] = await this.userModel.find({webid: webid, "social.email": email});
        if (dbResult.length > 0) return dbResult[0];
        else return {};
    }
}