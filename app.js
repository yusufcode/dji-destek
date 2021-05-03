const express = require('express')
const app = express()
const router = express.Router()
const mongoose = require('mongoose')

app.get('/', (req, res) => {
    res.send('deneme')
});

const port = process.env.port || 3000;
const server = app.listen(port, (err) => {
    if (err) { console.log('ERROR: ', err) } else { console.log('Server listen on port: ', port) }
})