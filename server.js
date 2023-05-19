// server inits
const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
require("dotenv").config();

// cors policy
const cors = require("cors");
app.use(cors({origin: 'https://blog-hub-chi.vercel.app', methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']})
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// db inits
const mongoose = require('mongoose');
mongoose.connect(process.env.CLOUD_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const database = mongoose.connection;
database.on('error', console.error.bind(console, 'Server could not connect to cloud'));
database.once('open', function() {
    console.log('Server has connected to database successfully');
});

const Token = require('./models/Token');

// routes inits
const RegisterRouter = require('./routes/auth/register');
const LoginRouter = require('./routes/auth/login');
const TokenRouter = require('./routes/auth/token');
const PostRouter = require('./routes/blog/post');

// middleware inits
app.get('/', async (req,res) => {
    res.json("REST express server");
});

app.use('/register', RegisterRouter);
app.use('/login', LoginRouter);
// refresh token endpoint
app.use("/token",TokenRouter);
app.delete("/logout", async (req,res) => {
    try{
        const accessToken = req.body.token;
        const deletedToken = await Token.deleteOne({token:accessToken});
        res.json(deletedToken);
    }catch(err){
        res.status(400).json({message:err.message});
    }
});
app.use('/posts', PostRouter);

// TEST valid user's data starts
const jwt = require("jsonwebtoken");
app.get("/authorizated",authorizedTokenMiddleware,(req,res) => {
    res.status(200).json(req.user.user);
});

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

// TEST valid user's data ends



app.listen(process.env.SERVER_PORT);

module.exports = { app };

