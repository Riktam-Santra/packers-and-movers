const User = require("../models/user.js");
const solana = require('@project-serum/anchor');
class UserRepo{

    async signUp(data){
        try {
            const keypair = solana.web3.Keypair.generate();
            const payload = { ...data , publicKey : keypair.publicKey.toString() , secretKey : JSON.stringify(keypair.secretKey)};
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
            return user;
        } catch (error) {
            console.log("user-repo login")
            throw error;
        }
    }
}

module.exports = UserRepo ; 