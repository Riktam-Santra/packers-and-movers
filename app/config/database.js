
const mongoose = require('mongoose');


 const connect = async ()=>{
    await mongoose.connect('mongodb+srv://testuser:chmod123@goodstracker.sh7oaew.mongodb.net/test');
}

module.exports = {
    connect
}