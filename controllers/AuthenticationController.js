const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

const registerController = async(req, res) => {
    try{

        if(await User.findOne({email: req.body.email})){
            return res.status(400).json({message: 'This email was already taken'});
        }

        if(await User.findOne({username:req.body.username})){
            return res.status(400).json({message: 'This username was already taken'});
        }

        const cryptedPassword = await bcrypt.hash(req.body.password,10);

        const newUserRecord = await new User({
            username: req.body.username,
            email: req.body.email,
            password: cryptedPassword
        });
        newUserRecord.save();

        res.status(201).json(newUserRecord);
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
}

const loginController = async(req,res) => {
    try {

        const user = await User.findOne({email:req.body.email});

        if(!user) {
            return res.status(404).json({message:"User couldn't be found"});
        }

        if (!await bcrypt.compare(req.body.password,user.password)){
            return res.status(400).json({message:"Password is incorrect"});
        }

        const accessToken = generateAccessToken(user);
        // const refreshToken = jwt.sign({user:user},process.env.REFRESH_TOKEN_SECRET);

        await Token.create({token:accessToken});

        res.status(200).json({accessToken:accessToken, userProfile:user});

    } catch(err){
        res.status(400).json({message:err.message});
    }
}

function generateAccessToken(user){
    return jwt.sign({user:user},process.env.ACCESS_TOKEN_SECRET,{});
}

module.exports = { registerController, loginController };