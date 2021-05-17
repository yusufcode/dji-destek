const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    name: {type:String},
    url: {type:String},
    code: {type:String}
}, {timestamps:true})

module.exports = mongoose.model('droneseries', Schema)