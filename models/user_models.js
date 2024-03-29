const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate : [validator.isEmail,'Please enter a valid email address']
    },
    password:{
        type: String,
        required: true,
        minLength:[8,"The password must be of 8 characters"]
    }
},
{
    timestamps:true,
}
);

const userModel = mongoose.model('User',userSchema);

module.exports =userModel;

