// server inits
const express = require('express');
const app = express();
app.listen(3000);

app.get('/', (req,res) => {
    res.send('My Lite Express Server');
})

