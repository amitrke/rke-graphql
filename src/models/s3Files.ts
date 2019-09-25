import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class S3Files {

    @Field()
    fileBase64Data: string;

}