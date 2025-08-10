const { required } = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true, 'Please provide username'],
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:[true, 'Please provide email'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'
        ],
        unique:true
    },
    password:{
        type:String,
        required:[true, 'Please provide password'],
        minlength:6
    }
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.getJwtToken = function () {
    return jwt.sign({id:this._id, name:this.username, email:this.email}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME});
}

userSchema.methods.checkPassword = async function (inputPassword) {
    const isPasswordValid = await bcrypt.compare(inputPassword, this.password);
    return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);