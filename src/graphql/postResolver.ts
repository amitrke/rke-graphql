import { Resolver, Query, Arg, Args } from "type-graphql";
import { Posts } from "../models/post";
import { MongoService } from "../service/MongoService";
import { GetPostsArgs } from "../graphql/getpostargs";
import { getModelForClass } from "@typegoose/typegoose";

@Resolver(Posts)
export class PostResolver {

    private mongoService: MongoService;
    private postModel: any;

    constructor(){
        this.mongoService = new MongoService();
        this.postModel = getModelForClass(Posts);
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