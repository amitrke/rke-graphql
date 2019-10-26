import { APIGatewayEvent } from "aws-lambda";
import { HttpResp } from "../common/httpresp";
import { JWK, JWE } from "node-jose";
import { MongoService } from "../service/MongoService";
import { Users, Social } from "../models/user";
import { getModelForClass } from "@typegoose/typegoose";
const axios = require("axios").default;
const fs = require("fs").promises;

export class AuthLmda {
  private privateKey: any;
  private publicKey: any;
  private mongoService: MongoService;
  private userModel: any;

  constructor() {
    this.mongoService = new MongoService();
    this.userModel = getModelForClass(Users);
  }
  /**
   * Login Lambda
   */
  public handler = async (event: APIGatewayEvent) => {
    //console.log(JSON.stringify(event));

    if (!this.privateKey) {
      const makeKey = pem => JWK.asKey(pem, "pem");
      console.log("Generating new jose keypair");
      const pubKey = await fs.readFile("pub.txt");
      const privateKey = await fs.readFile("private.txt");
      this.privateKey = await makeKey(privateKey);
      this.publicKey = await makeKey(pubKey);
    }

    if (event.headers.Authorization) {
      let token = event.headers.Authorization;
      console.log(`Received google token ${token}`);
      try {
        const googleAuthRes = await axios.get(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=${token}`
        );
        console.log(googleAuthRes);
        let newEncData = await this.createTokenData(event, googleAuthRes);
        const encryptedToken = await this.encrypt(newEncData);
        return HttpResp.buildResp({ token: encryptedToken, userid: newEncData.userid }, 200);
      } catch (err) {
        console.error("Couldn't validate token", err);
        return HttpResp.buildResp(err, 400);
      }
    } else {
      return HttpResp.buildResp(
        { message: "Missing Authorization header" },
        400
      );
    }
  };

  private createTokenData = async (
    event: APIGatewayEvent,
    googleAuthRes: any
  ) => {
    let webid = "unknown";
    switch (event.headers.Origin) {
      case "http://localhost:4200":
      case "http://www-dev.aws.roorkee.org":
        webid = "rke-dev";
        break;
      case "http://www.aws.roorkee.org":
        webid = "rke-prod";
        break;
      default:
        console.log(`Unknown origin ${event.headers.Origin}`);
    }
    await this.mongoService.connect();
    const dbResult: Users[] = await this.userModel.find({
      webid: webid,
      "social.email": googleAuthRes.data.email
    });

    let user;

    if (dbResult.length > 0) {
        if (dbResult.length > 1){
            console.warn(`DATA-WARNING: Found more than one record for the user ${googleAuthRes.data.email}, webid=${webid}`);
        }
      user = dbResult[0].id;
    } else {
      user = this.createUser(googleAuthRes.data, webid);
    }

    return {
      userid: user,
      webid: webid,
      expires_in: googleAuthRes.data.expires_in,
      issued_at: googleAuthRes.data.issued_at,
      email: googleAuthRes.data.email
    };
  };

  private createUser = async (googleAuthRespData, webid: string) => {
    let user = new Users();
    user.webid = webid;
    let social = new Social();
    social.email = googleAuthRespData.email;
    social.id = googleAuthRespData.user_id;
    social.type = "gl";
    user.social = [social];
    user.type = "pr-user";
    user.created = new Date();
    user.lastLogin = new Date();
    const { _id: id } = await this.userModel.create(user);
    user.id = id;
    return user;
  };

  /**
   * Auth Lambda
   */
  public authHandler = async event => {
    var token = event.authorizationToken;

    if (!this.privateKey) {
      const makeKey = pem => JWK.asKey(pem, "pem");
      console.log("Generating new jose keypair");
      const pubKey = await fs.readFile("pub.txt");
      const privateKey = await fs.readFile("private.txt");
      this.privateKey = await makeKey(privateKey);
      this.publicKey = await makeKey(pubKey);
    }

    try {
      const decryptedData = await this.decrypt(token);
      console.log(`Decrypted:`, decryptedData);
      return Promise.resolve(
        this.generatePolicy(
          decryptedData.userid,
          "Allow",
          event.methodArn,
          decryptedData
        )
      );
    } catch (err) {
      console.error("Couldn't validate token", err);
      return Promise.reject("Unauthorized");
    }
  };

  private encrypt = async (raw: any) => {
    if (!raw) throw new Error("Missing raw data.");
    const buffer = new Buffer(JSON.stringify(raw));
    return JWE.createEncrypt({ compact: true }, this.publicKey)
      .update(buffer)
      .final();
  };

  private decrypt = async (encrypted: any) => {
    if (!encrypted) throw new Error("Missing encrypted data.");
    const decr = await JWE.createDecrypt(this.privateKey).decrypt(encrypted);
    var buf = Buffer.from(decr.plaintext);
    return JSON.parse(buf.toString());
  };

  private generatePolicy = (principalId, effect, resource, context = {}) => {
    const authResponse: any = { principalId, context };

    if (effect && resource) {
      authResponse.policyDocument = {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: resource
          }
        ]
      };
    }

    return authResponse;
  };
}
