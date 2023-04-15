const mongoose = require('mongoose');
// import bcrypt from "bcrypt";
const Jwt = require('jsonwebtoken');
const deliverySchema = new mongoose.Schema({
    products : [{
        name : {
            type : String , 
            required : true 
        } , 
        weight : {
            type : String , 
            required : true 
        }
    }], 
    initialAddress : {
        type : String 
    } ,
    finalAddress : {
        type : String 
    }, 
    checkpoints : [
        {
            address : {
                type : String , 
                required : true 
            } , 
            latitude : {
                type : String , 
                required : true 
            } , 
            longitude : {
                type : String , 
                required : true 
            } , 
        }
    ] , 
    deliverer : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'User'
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



const Delivery = mongoose.model('Delivery' , deliverySchema);

module.exports = Delivery;