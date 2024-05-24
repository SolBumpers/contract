import { Account, PublicKey, Connection } from '@solana/web3.js'
import { RPC, ACCOUNT_CLIENT_PK, ACCOUNT_BOT_PK, ACCOUNT_PROTOCOL_PK } from './config'
import bs58 from 'bs58';

export async function genWallet(walletNbr: number) {
    const wallets = [];
    for (let i = 0; i < walletNbr; i++) {
        const wallet = new Account();
        const walletPK = new PublicKey(wallet.publicKey).toBase58();
        const walletSK = bs58.encode(Buffer.from(wallet.secretKey));
        wallets.push({ publicKey: walletPK, secretKey: walletSK });
    }
    return wallets;
}

export const balanceToStr = (balNbr: number) => {
    const balance = balNbr / (10 ** 9)
    const strBalance = balance.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })
    const mainStrBalance = strBalance.replace(',', '.')
    return mainStrBalance;
};

const getSolBal = async (publicKey: string, who: string) => {
    const account = new PublicKey(publicKey)
    const connection = new Connection(RPC, 'confirmed')
    const bal = await connection.getBalanceAndContext(account)
    console.log(`BALANCE ${who}: ${balanceToStr(bal.value)} SOL`)
    return bal.value
}

export const getBulkBalance = async () => {
    await getSolBal(ACCOUNT_CLIENT_PK, 'CLIENT ACCOUNT')
    await getSolBal(ACCOUNT_BOT_PK, 'BOT ACCOUNT')
    await getSolBal(ACCOUNT_PROTOCOL_PK, 'PROTOCOL ACCOUNT')
}