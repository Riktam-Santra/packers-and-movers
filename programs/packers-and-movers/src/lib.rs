use anchor_lang::prelude::*;

declare_id!("GDazepq9rJxEZmi3DR3k1ZcmAwUvQm5dmcf6atWPFumq");

#[program]
pub mod packers_and_movers {

    use std::vec;

    use anchor_lang::solana_program::entrypoint::ProgramResult;

    use super::*;

    pub fn initialize(ctx: Context<Initialize>, account_data: String) -> ProgramResult{
        msg!("{}", account_data);
        ctx.accounts.base_account.data = account_data;
        Ok(())
    }

    pub fn update(ctx: Context<Update>, delivery: String) -> ProgramResult{
        msg!("{}", delivery);
        ctx.accounts.base_account.deliveries.push(delivery);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 1024)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>
}

#[account]
pub struct BaseAccount {
    pub data: String,
    pub deliveries: Vec<String>
}