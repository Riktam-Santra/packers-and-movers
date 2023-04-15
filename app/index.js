const { AnchorProvider, workspace, web3, Program } = require("@project-serum/anchor");
const { PackersAndMovers } = require("../target/types/packers_and_movers");


const express = require('express');
const bodyParser = require('body-parser')

const { connect } = require('./config/database.js');

const UserRepo = require("./repository/userRepo");
const uRepo = new UserRepo();
const Delivery = require('./models/delivery.js');
const path = require("path");
const User = require("./models/user");
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const port = 5000;

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

app.get('/user/:publicKey',async(req,res)=>{
    const user = await uRepo.getUser(req.params.publicKey) ; 
    try{
        return res.status(200).json({
            data : user,
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



app.post('/delivery/:id' , async (req,res)=>{
    try{
        const product = await Delivery.create(req.body);
        const user = await User.findById(req.params.id);
        user.delivery.push(product);
        await user.save();
        return res.status(200).json({
            data : product , 
            success : true 
        })
    }catch(error){
        return res.status(500).json({
            data : {} , 
            success : false , 
            error : error 
        })
    }

})
app.get('/delivery/:id',async (req,res)=>{
    try {
        const product = await Delivery.findById(req.params.id).populate({path : 'deliverer'});
        return res.status(200).json({
            data : product , 
            success : true 
        })
        
    } catch (error) {
        return res.status(500).json({
            data : {} , 
            success : false , 
            error : error 
        })
    }
})

app.patch('/delivery/:id',async (req , res)=>{
    try{
        const product = await Delivery.findById(req.params.id) ; 
        product.checkpoints.push({
            address : req.body.address , 
            latitude : req.body.latitude , 
            longitude : req.body.longitude
        })
        await product.save();
        const updated = await Delivery.findById(req.params.id);
        res.status(200).json({
            data : updated , 
            success : true ,
            error : {}
        })
    }catch(error){
        res.status(500).json({
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
    const product = await Delivery.create({
        products : [{
            name : "cap" , 
            weight : 25
        } , 
        {
            name : "bottle" , 
            weight : 2 
        }] , 
        checkpoints : [
            {
                address : "hesoyam" , 
                latitude : "2455984",
                longitude : "193822"
            }
        ], 
        deliverer : "64399d2e47135789fb4fad0b"
    })
    // const output = await Delivery.findOne({
    //     _id : "6439ec36dd3a4f339847e023"});
    // const outputCheck = output;
    // console.log(outputCheck.deliverer._id);
    // const output = await Delivery.findById("6439ec36dd3a4f339847e023").populate({path : 'deliverer'});
    // console.log(output);
})