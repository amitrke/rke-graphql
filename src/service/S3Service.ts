import { S3 } from "aws-sdk";

export class S3Service {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      params: { Bucket: "www-static.aws.roorkee.org", region: "us-east-1" }
    });
  }

  public getFilesList = async (user: string, webid: string) => {
    let env;
    let bucket;
    switch (webid) {
      case "rke-dev":
        bucket = "www-static.aws.roorkee.org";
        env = "dev";
        break;
      case "rke-prod":
        bucket = "www-static.aws.roorkee.org";
        env = "prod";
        break;
      default:
        console.log(`Unknown webid ${webid}`);
    }

    var folder = `${env}/up/usr/${user}/`;
    var params = {
      Delimiter: "/",
      Prefix: folder,
      Bucket: bucket
    };

    var listResp = await this.s3.listObjectsV2(params).promise();
    let files = [];
    if (listResp && listResp.Contents && listResp.Contents.length > 0) {
      listResp.Contents.forEach(element => {
        if (element.Size > 0) {
          files.push(element);
        }
      });
    }
    return files;
  };
}
