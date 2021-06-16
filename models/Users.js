const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Schema = new mongoose.Schema({
    fullname: {
        type:String,
        required:true,
        minlength:3,
        maxlength:25
    },
    email: {
        type:String, 
        required:true,
        unique: true
    },
    password: {
        type:String,
        required:true,
        minlength:6
    },
    status: {type:Boolean}
}, {timestamps: true})

Schema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

Schema.statics.login = async function(email, password) {

    const user = await this.findOne({email})

    if (user.status == false) {
        throw 'Admin paneline giriş için izniniz bulunmuyor.'
    } else if (user) {
        const auth = await bcrypt.compare(password,user.password)
        if (auth) {
            return user
        } else {
            throw 'Parola hatalı.'
        }
    } else {
        throw 'Kullanıcı bulunamadı.'
    }
}

module.exports = mongoose.model('users', Schema)