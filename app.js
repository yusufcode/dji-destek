const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const mongoose = require('mongoose')
require('dotenv/config')
const bodyParser = require('body-parser')

//SET
app.set('view engine', 'ejs')

//USE
app.use('/assets', express.static('assets'))
app.use(expressLayouts)
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//IMPORT ROUTES
const indexRoute = require('./routes/indexRoute')

//USE ROUTES
app.use('/', indexRoute)

//DB
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to DB!')
});

//SERVER
const port = process.env.port || 3000
const server = app.listen(port, (err) => {
    if (err) { console.log('ERROR: ', err) } else { console.log('Server listen on port:', port) }
})