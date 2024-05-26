const bs58 = require('bs58');

const key = [13, 6, 150, 254, 117, 46, 224, 141, 50, 160, 61, 44, 75, 224, 12, 217, 237, 192, 205, 148, 217, 96, 160, 152, 231, 243, 129, 39, 208, 210, 213, 94]


function keypairToPrivateKeyString(keypair) {
    const privateKey = keypair.slice(0, 32);
    return bs58.encode(privateKey);
}

const privateKeyString = keypairToPrivateKeyString(key)

console.log('Private Key String:', privateKeyString)