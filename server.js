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
const registerRouter = require('./routes/register');

// middleware
app.get('/', (req,res) => {
    res.send('Express Restful Server');
});


app.use('/register', registerRouter);



app.listen(process.env.SERVER_PORT);

module.exports = { app };

