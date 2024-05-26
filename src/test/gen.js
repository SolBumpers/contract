const base58 = require('bs58');

const protocol_address = 'GH3AJux7zicopHnSCSHwgxhMaNeVLzUgxTNqCxS4LsRy';
const bot_address = '3KW9UmB16bpCE7qayxgixXj43vXVqAwEZp5aeFxNSyGU'

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