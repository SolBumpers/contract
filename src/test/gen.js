const base58 = require('bs58');

const protocol_address = '2LEHP4cHHYd1qWi21AgBMdPFHL9EbMKbk16hQzqnGtps';
const bot_address = 'J2R22pquB6YC45oo6gyjMEnAztdQ8mXZ6sCXmBFn8Sdj'

function genProtocol() {
    const publicKeyBytes = base58.decode(protocol_address);
    const publicKeyHex = Buffer.from(publicKeyBytes).toString('hex');
    const hexPairs = publicKeyHex.match(/.{1,2}/g);
    const decimalArray = hexPairs.map(pair => parseInt(pair, 16));
    console.log("PROTOCOL\n", decimalArray);
}

function genBot() {
    const publicKeyBytes = base58.decode(bot_address);
    const publicKeyHex = Buffer.from(publicKeyBytes).toString('hex');
    const hexPairs = publicKeyHex.match(/.{1,2}/g);
    const decimalArray = hexPairs.map(pair => parseInt(pair, 16));
    console.log("BOT\n", decimalArray);
}

function main() {
    genProtocol()
    genBot()
}

main()