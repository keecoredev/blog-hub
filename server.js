// server inits
const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
require("dotenv").config();

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

// routes inits
const RegisterRouter = require('./routes/auth/register');
const LoginRouter = require('./routes/auth/login');

// middleware inits
app.get('/', async (req,res) => {
    res.json("REST express server");
});

app.use('/register', RegisterRouter);
app.use('/login', LoginRouter);

app.listen(process.env.SERVER_PORT);

module.exports = { app };

