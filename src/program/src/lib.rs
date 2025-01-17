use solana_program::{account_info::{next_account_info, AccountInfo}, entrypoint, entrypoint::ProgramResult, msg, program_error::ProgramError, pubkey::Pubkey, system_instruction, program::invoke};
use borsh::{BorshDeserialize, BorshSerialize};

const PROTOCOL_FEE_PUBLIC_KEY: Pubkey = Pubkey::new_from_array([226, 251,  10,  43,  66,  70,  15, 243, 80, 125,  82, 120,  75, 185,  25, 206, 208,  53,  95, 167,  60,  92, 129, 183, 198,  48, 205, 158, 164,  56, 120, 184]);
const EXECUTOR_BOT_PUBLIC_KEY: Pubkey = Pubkey::new_from_array([ 34, 116, 200, 187, 126, 1, 243,  90, 29,  37,  88, 251,  55, 147, 147, 111, 87, 139, 125, 199, 120, 192,   4,  51, 126, 255, 197,  87, 210,   3,  89, 249 ]);

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct NewOrder {
    pub client: Pubkey,
    pub token: Pubkey,
    pub bot: u8,
    pub frequency: u8,
    pub duration: u32,
    pub funding: u32,
    pub fee: u32,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CancelOrder {
    pub id: u32,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct OrderData {
    pub orders: Vec<NewOrder>,
}

enum Instruction {
    CreateOrder,
    CancelOrder,
}

entrypoint!(process_instruction);

fn process_instruction(_program_id: &Pubkey, accounts: &[AccountInfo], instruction_data: &[u8]) -> ProgramResult {
    let instruction = match instruction_data.get(0) {
        Some(1) => Instruction::CreateOrder,
        Some(2) => Instruction::CancelOrder,
        _ => return Err(ProgramError::InvalidInstructionData),
    };
    match instruction {
        Instruction::CreateOrder => {
            let order_data = instruction_data.get(1..).ok_or(ProgramError::InvalidInstructionData)?;
            create_order(accounts, order_data)
        }
        Instruction::CancelOrder => {
            let order_id = u32::from_le_bytes(
                [
                    instruction_data.get(1).copied().unwrap_or(0),
                    instruction_data.get(2).copied().unwrap_or(0),
                    instruction_data.get(3).copied().unwrap_or(0),
                    instruction_data.get(4).copied().unwrap_or(0),
                ][..].try_into().unwrap(),
            );
            cancel_order(order_id)
        }
    }
}

fn create_order(accounts: &[AccountInfo], order_data: &[u8]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let client_account = next_account_info(accounts_iter)?;
    let protocol_fee_account = next_account_info(accounts_iter)?;
    let executor_bot_account = next_account_info(accounts_iter)?;

    let funding = u32::from_le_bytes([ order_data[38], order_data[39], order_data[40], order_data[41] ]);
    let fee = u32::from_le_bytes([ order_data[42], order_data[43], order_data[44], order_data[45] ]);

    let funding_u64 = u64::from(funding) * 10000000;
    let fee_u64 = u64::from(fee) * 10000000;

    if *executor_bot_account.key != EXECUTOR_BOT_PUBLIC_KEY { return Err(ProgramError::InvalidAccountData);}
    invoke(&system_instruction::transfer( client_account.key, executor_bot_account.key, funding_u64), &[ client_account.clone(), executor_bot_account.clone() ])?;

    if *protocol_fee_account.key != PROTOCOL_FEE_PUBLIC_KEY { return Err(ProgramError::InvalidAccountData);}
    invoke(&system_instruction::transfer( client_account.key, protocol_fee_account.key, fee_u64), &[ client_account.clone(), protocol_fee_account.clone() ])?;

    let token = Pubkey::new(&order_data[0..32]);
    let bot = order_data[32] as u8;
    let frequency = order_data[33] as u8;
    let duration = u32::from_le_bytes([ order_data[34], order_data[35], order_data[36], order_data[37]]);

    let order = NewOrder {
        client: *client_account.key,
        token,
        bot,
        frequency,
        duration,
        funding,
        fee,
    };

    msg!("{:?}", order);
    Ok(())
}

fn cancel_order(order_id: u32) -> ProgramResult { 
    let canceled_order = CancelOrder { id: order_id };
    msg!("{:?}", canceled_order);
    Ok(())
}