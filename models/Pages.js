const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    page: {type:String},
    title: {type:String},
    description: {type:String},
    keywords: {type:String},
    author: {type:String},
    bodyClass: {type:String},
    seoText: {type:String}
}, {timestamps:true})

module.exports = mongoose.model('pages', Schema)