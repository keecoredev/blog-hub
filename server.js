// server inits
const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
require("dotenv").config();

// cors policy
const cors = require("cors");
app.use(cors({origin: 'https://blog-hub-chi.vercel.app', methods: ['GET','POST','DELETE','PUT','PATCH']})
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

// routes init
const RegisterRouter = require('./routes/auth/register');
const LoginRouter = require('./routes/auth/login');
const TokenRouter = require('./routes/auth/token');
const PostRouter = require('./routes/blog/post');

// classes init
const AuthorizationHelper = require('./classes/helper/AuthorizationHelper');

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

app.use('/posts', AuthorizationHelper.postAuthorizationHelper, PostRouter);


// TEST valid user's data starts

const jwt = require("jsonwebtoken");
app.get("/authorizated",AuthorizationHelper.authorizedTokenMiddleware, (req,res) => {
    req.user.user.newFeature = 'dummy';
    res.status(200).json(req.user.user);
});

// TEST valid user's data ends



app.listen(process.env.SERVER_PORT);

module.exports = { app };

