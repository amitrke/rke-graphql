import { ObjectType, Field } from "type-graphql";
import { prop, Typegoose } from '@typegoose/typegoose';
import { S3Files } from "./s3Files";
import { Posts } from "./post";
import { ObjectId } from "bson";

@ObjectType()
export class Users extends Typegoose {

    @Field()
    id: string;

    _id: ObjectId;

    @Field() @prop()
    name: string;

    @Field() @prop()
    type: string;

    @Field() @prop()
    created: Date;

    @Field() @prop()
    lastLogin: Date;

    @Field() @prop()
    webid: string;

    @Field(type => [Social]) @prop()
    social: Social[];

    @Field(type => [S3Files])
    files: [S3Files];

    @Field(type => [Posts])
    posts: [Posts];
}

@ObjectType()
export class Social {
    @Field()
    id: string;

    @Field() @prop()
    type: string;

    @Field() @prop()
    email: string;

    @Field() @prop()
    profilePic: string;
}