const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password!');
    }

    const user = await User.findOne({email});

    if(!user) {
        throw new UnauthenticatedError('User does not exist!');
    }

    const isPasswordValid = await user.checkPassword(password);

    if(!isPasswordValid) {
        throw new UnauthenticatedError('Incorrect password!');
    }

    const token = user.getJwtToken();

    res.status(StatusCodes.OK).json({user:{ id:user._id,name:user.username, email:user.email}, token});
}

const registerUser = async (req, res) => {

    const user = await User.create({...req.body});

    const jwtToken = user.getJwtToken();

    res.status(StatusCodes.CREATED).json({user:{id:user._id, name:user.username, email:user.email}, token});
}

module.exports = {
    loginUser,
    registerUser
}