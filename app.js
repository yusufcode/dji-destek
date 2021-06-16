const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const mongoose = require('mongoose')
require('dotenv/config')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

//CONFIG

//MIDDLEWARES
const {requireAuth, checkUser} = require('./middlewares/authMiddleware')

//MODELS
require('./models/DroneSeries')
require('./models/DroneModels')

//SET
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout');

//USE
app.use('/assets', express.static('assets'))
app.use(expressLayouts)
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())

//IMPORT ROUTES
const indexRoutes = require('./routes/indexRoutes')
const adminRoutes = require('./routes/adminRoutes')
const otherRoutes = require('./routes/otherRoutes')

//USE ROUTES
app.use('/', indexRoutes)
app.use('/admin', requireAuth, checkUser, adminRoutes)
app.use('/', otherRoutes)

//DB

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if(err) {
        console.log('ERROR! DB Connection is fault!')
    } else {
        console.log('Connected to DB!')
    }
});


//SERVER
const port = process.env.PORT || 5001
const server = app.listen(port, (err) => {
    if (err) { console.log('ERROR: ', err) } else { console.log('Server listen on port:', port) }
})