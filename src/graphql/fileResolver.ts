import { S3 } from 'aws-sdk';
import { Resolver, Mutation, Arg, Query, Ctx } from 'type-graphql';
import { S3Files } from '../models/s3Files';

@Resolver(S3Files)
export class FileResolver {

    private s3: S3;

    constructor(){
        this.s3 = new S3({ params: {Bucket: 'www-static.aws.roorkee.org', region: 'us-east-1'}});
    }

    @Query(returns => [S3Files])
    async getFilesList(@Arg("user") user: string, @Arg("env") env: string) {
        var folder = `${env}/up/usr/${user}/`;
        var params = { 
            Delimiter: '/',
            Prefix: folder,
            Bucket: 'www-static.aws.roorkee.org'
        }

        var listResp = await this.s3.listObjectsV2(params).promise();
        let files = [];
        if (listResp && listResp.Contents && listResp.Contents.length > 0){
            listResp.Contents.forEach(element => {
                if (element.Size > 0){
                    files.push(element);
                }
            });
        }
        return files;
    }
    
    @Mutation(returns => S3Files)
    async deleteFile(@Arg("id") fileId: string) {
        let obj = new S3Files();
        var params = {
            Key: fileId,
            Bucket: 'www-static.aws.roorkee.org'
        };
        
        try{
            var resp = await this.s3.deleteObject(params).promise();
            obj.deleteMarker = true;
            return JSON.stringify(obj);
        }
        catch(err){
            console.log(JSON.stringify(err));
            return err;
        }
    }

    @Mutation(returns => S3Files)
    async uploadFile(@Arg("fileData") fileData: string, @Arg("name") name: string) {
        let obj = new S3Files();
        obj.fileBase64Data = fileData;

        let buf = new Buffer(fileData.replace(/^data:image\/\w+;base64,/, ""),'base64');

        if (buf.length / 1e+6 > 1){
            throw "Upload filesize should be less than 1 MB";
        }

        var params = {
            Key: name, 
            Body: buf,
            ContentEncoding: "base64",
            Bucket: 'www-static.aws.roorkee.org'
        };
        
        try{
            var resp = await this.s3.putObject(params).promise();
            return resp;
        }
        catch(err){
            console.log(`Error occured while s3 putObject for ${name}`, JSON.stringify(err));
        }

        return obj;
    }


}