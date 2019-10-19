import { ObjectType, Field } from "type-graphql";
import { prop, Typegoose } from '@typegoose/typegoose';

@ObjectType()
export class Posts extends Typegoose {

    @Field()
    id!: string;

    @Field() @prop()
    title!: string;
    
    @Field() @prop()
    description!: string;

    @Field() @prop()
    fulltext!: string;

    @Field(type => [String]) @prop()
    images!: string[];
    
    @Field() @prop()
    author!: string;
    
    @Field() @prop()
    created!: Date;
    
    @Field() @prop()
    status!: string;
    
    @Field() @prop()
    webid!: string;
}