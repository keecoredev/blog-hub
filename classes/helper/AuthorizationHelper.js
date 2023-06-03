const jwt = require("jsonwebtoken");

function postAuthorizationHelper(req, res, next){
    const bearerHeader = req.headers["authorization"];

    let token;

    if (bearerHeader != undefined){
        if(bearerHeader.includes(" ")){
            token = bearerHeader.split(" ")[1];
        }
    }

    if(token != undefined || token != null){
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user) => {
            if (err){
                return res.status(403).json({message:err.message})
            }
            req.user = user;
        });
    }

    next();
}

function authorizedTokenMiddleware (req,res,next) {
    const bearerHeader = req.headers["authorization"];

    if(bearerHeader === null || bearerHeader === "undefined"){
        return res.status(404).json({message:"There is no Authorization Header on request"});
    }

    const token = bearerHeader.split(" ")[1];

    if (token === null || token === "undefined"){
        return res.status(404).json({message:"There is no token o header"});
    }

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user) => {
        if (err){
            return res.status(403).json({message:err.message})
        }
        req.user = user;
        next();
    })
}

module.exports = { postAuthorizationHelper, authorizedTokenMiddleware };