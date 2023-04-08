// server inits
const express = require('express');
const app = express();
app.listen(3000);
require("dotenv").config();
// db inits
const mongoose = require('mongoose');
mongoose.connect(process.env.CLOUD_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const database = mongoose.connection;
database.on('error', console.error.bind(console, 'Server could not connect to cloud'));
database.once('open', function() {
    console.log('Server has connected to database successfully');
});

app.get('/', (req,res) => {
    res.send('My Lite Express Server');
});

module.exports = { app };

