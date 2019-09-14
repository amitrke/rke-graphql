import { Resolver, Query, Arg } from "type-graphql";
import { Posts } from "../models/post";
import { MongoService } from "../service/MongoService";
import { Model } from "mongoose";

@Resolver(Posts)
export class PostResolver {

    private mongoService: MongoService;
    private postModel: Model<InstanceType<Posts>>;

    constructor(){
        this.mongoService = new MongoService();
        this.postModel  = new Posts().getModelForClass(Posts);
    }

    @Query(returns => Posts)
    async getPost(@Arg("id") id: string) {
        console.log(`In resolver, id=${id}`);

        await this.mongoService.connect();
        const dbResult:Posts = await this.postModel.findById(id);
        console.dir(dbResult);
        return dbResult;
    }
}