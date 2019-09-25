import { S3 } from 'aws-sdk';
import { Resolver, Mutation, Arg } from 'type-graphql';
import { S3Files } from '../models/s3Files';

@Resolver(S3Files)
export class FileResolver{

    private s3: S3;

    constructor(){
        this.s3 = new S3({ params: {Bucket: 'www-static.aws.roorkee.org', region: 'us-east-1'}});
    }

    @Mutation(returns => S3Files)
    async uploadFile(@Arg("fileData") fileData: string) {
        let obj = new S3Files();
        obj.fileBase64Data = fileData;
        return obj;
    }
}