const User = require('../models/User');
const bcrypt = require('bcrypt');

const registerController = async(req, res) => {
    try{
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

module.exports = { registerController };