const jwt = require('jsonwebtoken')
const Users = require('../models/Users')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    if(token) {
        jwt.verify(token, 'gizli kelime', (err,decoded) => {
            if(err){
                console.log(err)
                res.redirect('/admin-giris')
            } else {
                next()
            }
        })
    } else{
        console.log('Token not provided.')
        res.redirect('/admin-giris')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if(token) {
        jwt.verify(token, 'gizli kelime', async (err,decoded) => {
            if(err){
                console.log(err)
                res.locals.user = null
            } else {
                let user = await Users.findById(decoded.id)
                res.locals.user = user
                next()
            }
        })
    } else{
        res.locals.user = null
    }
}

 module.exports = {requireAuth, checkUser}