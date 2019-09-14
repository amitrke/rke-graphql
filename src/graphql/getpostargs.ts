import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class GetPostsArgs{

    @Field(type => String, { nullable: true })
    author?: string;

    @Field(type => String, { nullable: true })
    status?: string;

    @Field({ nullable: false })
    webid?: string;

}
