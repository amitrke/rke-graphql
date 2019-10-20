import { APIGatewayEvent } from "aws-lambda";
import { HttpResp } from "../common/httpresp";
import { JWK, JWE } from "node-jose";
const axios = require('axios').default;
const fs = require('fs').promises;

export class AuthLmda {

    private privateKey: any;
    private publicKey: any;

    public handler = async (event: APIGatewayEvent) => {
        console.log(JSON.stringify(event));

        if (!this.privateKey){
            const makeKey = pem => JWK.asKey(pem, 'pem');
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
                const encryptedToken = await this.encrypt(googleAuthRes.data);
                // const decryptedData = await this.decrypt(encryptedToken);
                // console.log(`Decrypted:`, decryptedData);
                return HttpResp.buildResp({token: encryptedToken}, 200);
            } catch (err) {
                console.error("Couldn't validate token", err);
                return HttpResp.buildResp(err, 400);
            }
        } else {
            return HttpResp.buildResp({message: "Missing Authorization header"}, 400);
        }
    }

    private encrypt = async (raw: any) => {
        if (!raw) throw new Error('Missing raw data.')
        const buffer = new Buffer(JSON.stringify(raw));
        return JWE.createEncrypt({compact: true}, this.publicKey).update(buffer).final();
    }

    private decrypt = async (encrypted: any) => {
        if (!encrypted) throw new Error('Missing encrypted data.')
        const decr = await JWE.createDecrypt(this.privateKey).decrypt(encrypted);
        var buf = Buffer.from(decr.plaintext);
        return JSON.parse(buf.toString());
    }
}