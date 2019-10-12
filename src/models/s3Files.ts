import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class S3Files {

    @Field()
    fileBase64Data: string;

    @Field()
    ETag: string;

    @Field()
    Key: string;

    @Field()
    LastModified: Date;

    @Field()
    Size: number;

    @Field()
    deleteMarker: boolean;
}