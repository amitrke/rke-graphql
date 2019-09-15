import { Resolver, Query, Arg, ArgsType, Args } from "type-graphql";
import { Posts } from "../models/post";
import { MongoService } from "../service/MongoService";
import { Model } from "mongoose";
import { GetPostsArgs } from "../graphql/getpostargs";

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
        await this.mongoService.connect();
        const dbResult:Posts = await this.postModel.findById(id);
        return dbResult;
    }

    @Query(returns => [Posts])
    async getPosts(@Args() {author, status, webid}:GetPostsArgs) {
        await this.mongoService.connect();
        let filter = {};
        if (author) filter['author'] = author;
        if (status) filter['status'] = status;
        if (webid) filter['webid'] = webid;
        const dbResult:Posts[] = await this.postModel.find(filter);
        return dbResult;
    }
}