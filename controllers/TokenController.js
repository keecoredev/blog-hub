const jwt = require('jsonwebtoken');


const tokenController = async (req,res) => {
    try{
        const refreshToken = req.body.token;

        if(refreshToken == null){
            return res.status(422).json({message:"token not found"});
        }

        const dbToken = await Token.findOne({token:refreshToken});

        if(dbToken == null){
            return res.status(422).json({message:"token not found (maybe logged out)"});
        }

        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user) => {

            if (err){
                return res.status(400).json({message:err.message});
            }

            const parsedUser = user.user;
            const accessToken = generateAccessToken(parsedUser);
            res.status(200).json({accessToken:accessToken});
        });

    } catch(err){
        res.status(404).json({mongoose:err.message});
    }
}

function generateAccessToken(user){
    return jwt.sign({user:user},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"30m"});
}

module.exports = {
    tokenController
}