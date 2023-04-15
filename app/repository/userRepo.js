const User = require("../models/user.js");
const solana = require('@project-serum/anchor');


const {SystemProgram} = solana.web3;
class UserRepo{
    constructor(){
        this.provider = solana.AnchorProvider.env();
    }
    async signUp(data){
        try {
            const keypair = solana.web3.Keypair.generate();
            solana.setProvider(this.provider);
            const program = solana.workspace.PackersAndMovers;

            const payload = { ...data , publicKey : keypair.publicKey.toString() };
            await program.methods.initialize(JSON.stringify(payload)).accounts(
                {baseAccount: keypair.publicKey,
                user: this.provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
              }).signers([keypair]).rpc();
            console.log(payload)
            const user =  await User.create(payload);
            return user;
        } catch (error) {
            console.log("user-repo signUp")
            throw error;
        }
    }

    async login(data){
        try {
            const user = await User.findOne(data);
            if(!user) throw {
                success : "false", 
                msg : "user not found"
            }
            const program = solana.workspace.PackersAndMovers;
            const account =await program.account.baseAccount.fetch(user.publicKey);
            const jsonReceived = {info: JSON.parse(account.data), deliveries: account.deliveries.map((e) => JSON.parse(e))};
            console.log(JSON.stringify(jsonReceived));
            return user;
        } catch (error) {
            console.log("user-repo login")
            throw error;
        }
    }

    async getUser(publicKey){
        try {
            const program = solana.workspace.PackersAndMovers;
            const account =await program.account.baseAccount.fetch(publicKey);
            const jsonReceived = {info: JSON.parse(account.data), deliveries: account.deliveries.map((e) => JSON.parse(e))};
            // console.log(JSON.stringify(jsonReceived).info);
            return jsonReceived.info;
        } catch (error) {
            console.log("user-repo getUser");
            throw error;
        }
    }
}

module.exports = UserRepo ; 