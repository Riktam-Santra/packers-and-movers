const mongoose = require('mongoose');
// import bcrypt from "bcrypt";
const Jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    email : {
        type : String , 
        required : true ,
        unique : true 
    } , 
    username : {
        type : String , 
        required : true , 
        unique : true 
    },
    publicKey : {
        type : String , 
        required : true , 
        unique : true 
    },
    secretKey : {
        type : String , 
        required : true , 
        unique : true 
    },
    password : {
        type : String , 
        required : true 
    } , 
    name : {
        type : String , 
        required : true 
    } , 
    role : {
        type : String , 
        enum : ['customer' , 'deliverer'] , 
        required : true 
    },
    address : {
        type : String 
    } 
    

} , {timestamps:true} );

// userSchema.pre('save',function(next){
//     const user = this;
//     const SALT = bcrypt.genSaltSync(9);
//     const encryptedPassword = bcrypt.hashSync(user.password , SALT);
//     user.password = encryptedPassword;
//     next();
// })

// userSchema.methods.comparePassword = function compare(password){
//     return bcrypt.compareSync(password , this.password);
// }

userSchema.methods.genJWT = function generate(){
    return Jwt.sign({id : this._id , email : this.email }, 'secret' , {
        expiresIn : '1h'
    })
}

const User = mongoose.model('User' , userSchema);

module.exports = User;