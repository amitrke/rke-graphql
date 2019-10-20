import * as generateRSAKeypair from "generate-rsa-keypair";
const fs = require('fs').promises;

async function saveKeys(){
    const pair = generateRSAKeypair();
    await fs.writeFile('pub.txt', pair.public);
    await fs.writeFile('private.txt', pair.private);
}

saveKeys();