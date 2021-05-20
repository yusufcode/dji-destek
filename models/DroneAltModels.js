const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    name: {type:String},
    url: {type:String},
    title: {type:String},
    description: {type:String},
    keywords: {type:String},
    code: {type:String}
}, {timestamps:true})

module.exports = mongoose.model('dronealtmodels', Schema)