const { AnchorProvider, workspace, web3, Program } = require("@project-serum/anchor");
const { PackersAndMovers } = require("../target/types/packers_and_movers");


const express = require('express');
const bodyParser = require('body-parser')

const { connect } = require('./config/database.js');

const UserRepo = require("./repository/userRepo");
const uRepo = new UserRepo();

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const port = 3000;

const provider = AnchorProvider.env();
const program = workspace.PackersAndMovers;

var baseAccount;

app.get('/test', (req, res) => {
    res.send('Working!')
})

app.post('/signup', async (req, res) => {
    try {
        const user = await uRepo.signUp(req.body);
        return res.status(200).json({
            data: user,
            success: true,
            error: {}
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            error: error
        })
    }
    // let info = req.body;
    // if(!req.body) {
    //     res.send("No body supplied");

    // } else {
    //     baseAccount = web3.Keypair.generate();
    //     program.methods.initialize(JSON.stringify(info)).accounts(
    //         {baseAccount: baseAccount.publicKey,
    //         user: provider.wallet.publicKey,
    //         systemProgram: web3.SystemProgram.programId,
    //       }).signers([baseAccount]).rpc().then((e) => {res.send(JSON.stringify({publicKey: baseAccount.publicKey}));});
    // }

})

app.post('/login' , async (req,res)=>{
    try{
        const user = await uRepo.login(req.body);
        if(!user) return res.status(404).json({
            data : {} , 
            success : false ,
            error : "no user found"
        })
        const token = user.genJWT(); 
        return res.status(200).json({
            data :  {
                token : token
            }  ,
            success : true ,
            error : {}
        })
    }catch(error){
         return res.status(500).json({
            data : {} , 
            success : false , 
            error : error 
        })
    }

})

app.listen(port, async () => {
    console.log(`API running on port ${port}`);
    await connect();
    // const User = await uRepo.signUp({
    //     name: "Ayush",
    //     email: "askdln",
    //     username: "heslfnkoyam",
    //     password: "dsnfdn",
    //     role: "customer",

    // });
    // console.log(User);

})