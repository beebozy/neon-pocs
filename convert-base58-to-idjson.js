// convert-base58-to-idjson.js


import bs58 from "bs58"
import fs from "fs"


// paste your base58 private key string here
const base58PrivateKey = '3tRcc41j2dkYtwa9wdks9U7AN3CabtzZFSuJAC7g1WSuHTk4abdMotrGvzLifUkkduqjQpV42QsaWMadD2vPg37E';

const secretKey = bs58.decode(base58PrivateKey);
fs.writeFileSync('id.json', JSON.stringify(Array.from(secretKey)));

console.log("secret key", secretKey);

console.log('✅ id.json generated');
