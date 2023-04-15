const User = require('../models/User');
const bcrypt = require('bcrypt');

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
    try{
        const user = await User.findOne({email: req.body.email});

        !user
            ? res.status(422).json({message: 'User is not found'})
        : !await bcrypt.compare(req.body.password, user.password)
            ? res.status(400).json({message: 'Password is incorrect'})
        : res.status(200).json(user);
    }
    catch(error){
        res.status(400).json({message: error.message});
    }
}

module.exports = { registerController, loginController };