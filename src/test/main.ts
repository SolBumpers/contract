import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL, SystemProgram, TransactionInstruction, Transaction, sendAndConfirmTransaction } from '@solana/web3.js'
import { RPC, PROGRAM_ID, ACCOUNT_CLIENT_PK, ACCOUNT_CLIENT_SK, ACCOUNT_BOT_PK, ACCOUNT_BOT_SK, ACCOUNT_PROTOCOL_PK, ACCOUNT_PROTOCOL_SK } from './config/config'
import { getBulkBalance } from './config/utils';
import bs58 from 'bs58';

const connection = new Connection(RPC, 'confirmed')
const programId = new PublicKey(PROGRAM_ID);

const accountClientPk = new PublicKey(ACCOUNT_CLIENT_PK)
const accountClientSk = bs58.decode(ACCOUNT_CLIENT_SK)
const accountClientKeypair = Keypair.fromSecretKey(accountClientSk)

const accountBotPk = new PublicKey(ACCOUNT_BOT_PK)
const accountBotSk = bs58.decode(ACCOUNT_BOT_SK)
const accountBotKeypair = Keypair.fromSecretKey(accountBotSk)

const accountProtocolPk = new PublicKey(ACCOUNT_PROTOCOL_PK)
const accountProtocolSk = bs58.decode(ACCOUNT_PROTOCOL_SK)
const accountProtocolKeypair = Keypair.fromSecretKey(accountProtocolSk)

async function createOrder(whoPk: PublicKey, whoKeypair: Keypair) {
    const token = '5GZzvDk5shHsetQzqekxr724fBR9uCu3P8bMnzPYePGv'
    const tokenBytes = bs58.decode(token);
    const bot = 3;
    const frequency = 60;
    const duration = 24;
    const funding_lp = (1 * 100);
    const fee_lp = (0.25 * 100);

    const orderData = Buffer.alloc(46);
    orderData.set(tokenBytes, 0);
    orderData.writeUInt8(bot, 32);
    orderData.writeUInt8(frequency, 33);
    orderData.writeUInt32LE(duration, 34);
    orderData.writeUInt32LE(funding_lp, 38);
    orderData.writeUInt32LE(fee_lp, 42);

    const instructionData = Buffer.from([1, ...orderData]);
    const transaction = new Transaction().add(
        new TransactionInstruction({
            keys: [
                { pubkey: whoPk, isSigner: true, isWritable: true },
                { pubkey: accountProtocolPk, isSigner: false, isWritable: true },
                { pubkey: accountBotPk, isSigner: false, isWritable: true },
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
            ],
            programId,
            data: instructionData,
        })
    )

    const tx = await sendAndConfirmTransaction(connection, transaction, [whoKeypair])
    console.log(tx, '\n')
}

function buildCancelInstructionData(orderId: number) {
    const instructionData = Buffer.alloc(5)
    instructionData.writeUInt32LE(orderId, 1)
    instructionData[0] = 2
    return instructionData
}

async function cancelOrder(whoPk: PublicKey, whoKeypair: Keypair, orderId: number) {
    const instructionData = buildCancelInstructionData(orderId)
    const transaction = new Transaction().add(
        new TransactionInstruction({
            keys: [{ pubkey: whoPk, isSigner: true, isWritable: true }],
            programId,
            data: instructionData,
        })
    )
    // const tx = await connection.simulateTransaction(transaction, [whoKeypair]);
    const tx = await sendAndConfirmTransaction(connection, transaction, [whoKeypair])
    console.log(tx, '\n')
}

async function main() {
    await getBulkBalance()
    // console.log('\nPROCESSING INITIALIZATION...\n')
    // await initialize(newAccountPubkey, accountOwnerKeypair)
    console.log('\nCREATING ORDER...\n')
    await createOrder(accountClientPk, accountClientKeypair)
    //console.log('\nCANCELING ORDER...\n')
    //await cancelOrder(accountClientPk, accountClientKeypair, 657182)
    await getBulkBalance()
}

main()

// async function initialize(accountPk: PublicKey, accountKeypair: Keypair) {
//     const instructionData = Buffer.from([4])
//     const transaction = new Transaction().add(
//         new TransactionInstruction({
//             keys: [
//                 { pubkey: accountPk, isSigner: false, isWritable: true },
//                 { pubkey: accountKeypair.publicKey, isSigner: true, isWritable: false },
//                 { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
//             ],
//             programId,
//             data: instructionData,
//         })
//     )
//     // const tx = await connection.simulateTransaction(transaction, [accountKeypair]);
//     const tx = await sendAndConfirmTransaction(connection, transaction, [accountKeypair])
//     console.log(tx)
// }

// async function createOrder(whoPk: PublicKey, whoKeypair: Keypair) {
//     const token = '7mNr7p9ezf4mKafTrXV2v9ckbQnyPvXWPGc61TQd1mTM'
//     const tokenBytes = bs58.decode(token);
//     const bot = 25;
//     const frequency = 5;
//     const duration = 48;
//     const funding = 100;
//     const fee = 10;

//     const orderData = Buffer.alloc(46);
//     orderData.set(tokenBytes, 0);
//     orderData.writeUInt8(bot, 32);
//     orderData.writeUInt8(frequency, 33);
//     orderData.writeUInt32LE(duration, 34);
//     orderData.writeUInt32LE(funding, 38);
//     orderData.writeUInt32LE(fee, 42);

//     const instructionData = Buffer.from([1, ...orderData]);
//     const transaction = new Transaction().add(
//         new TransactionInstruction({
//             keys: [
//                 { pubkey: whoPk, isSigner: true, isWritable: true },
//                 { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
//             ],
//             programId,
//             data: instructionData,
//         })
//     )
//     // const tx = await connection.simulateTransaction(transaction, [whoKeypair]);
//     const tx = await sendAndConfirmTransaction(connection, transaction, [whoKeypair])
//     console.log(tx, '\n')
// }