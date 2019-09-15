import { ObjectType, Field } from "type-graphql";
import { prop, Typegoose } from '@hasezoey/typegoose';

@ObjectType()
export class Users extends Typegoose {

    @Field()
    id: string;

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