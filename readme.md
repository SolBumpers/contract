# Testing on Solana Devnet

If you would like to test this program on the Solana devnet, a complete configuration is already available in `/src/test/config/config.ts`, including a contract already deployed and 3 funded test accounts ('CLIENT', 'BOT', and 'PROTOCOL').

## Testing Steps

**Install Dependencies**/ First, install the required dependencies by running:

`npm install`

**Run the Main Script**/ Second, run main script : 

`npm run start`

Main script is configurate to create the following order : 

```
{
    token = 5GZzvDk5shHsetQzqekxr724fBR9uCu3P8bMnzPYePGv
    bot = 3 
    frequency = 60 s
    duration = 24 h
    funding = 1 SOL
    fee = 0.25 SOL
}
```
This means that each time the main script is run, the 'CLIENT_ACCOUNT' needs to have at least 1.25 SOL + 0.000005 SOL for the transaction fee, or the transaction will revert.

**Request Airdrop (if needed)**/ If the 'CLIENT_ACCOUNT' does not have enough SOL, you can request an airdrop using one of the following methods:

- using solana cli: `solana airdrop 1 6u1TmWs42bz7uXbgwHxMZfcQnc2u4QXwWH7DcEwPLEVf`
- or request here : https://dev.helius.xyz/dashboard/app

# Mainnet Deployment

## 1/ Generate Wallets

Generate two wallets:

- One for `BOT_EXECUTOR`
- One for `PROTOCOL_FEE_RECIPIENT`

## 2/ Generate Byte Arrays

For these 2 generated wallets: 
- Go to `/src/test/gen.js`
- Replace `protocol_address` value with the `PROTOCOL_FEE_RECIPIENT` public key (Base58).
- Replace `bot_address` value with the `BOT_EXECUTOR` public key (Base58).
- Run the base58tobytearraygen script with `npm run gen`.

## 3/ Set the Fee Recipient and Bot Address in the Solana Program

- Go to `/src/program/src/lib.rs`
- Replace the byte array of `PROTOCOL_FEE_PUBLIC_KEY` with your `PROTOCOL_FEE_RECIPIENT` byte array.
- Replace the byte array of `EXECUTOR_BOT_PUBLIC_KEY` with your `BOT_EXECUTOR` byte array.

## 4/ Compile and Deploy the Solana Program

- To compile, run : `npm run build:program`
- To deploy, run : `solana program deploy ./dist/program/bumpers.so`

(You will then be able to find the IDL and program keypair inside '/dist/program')