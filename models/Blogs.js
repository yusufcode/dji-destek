const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    Id: {type:Number},
    url: {type:String},
    title: {type:String},
    description: {type:String},
    keywords: {type:String},
    author: {type:String},
    bodyClass: {type:String},
    blogTitle: {type:String},
    blogText: {type:String},
    blogImage: {type:String},
    blogStatus: {type:Boolean}
}, {timestamps:true})

module.exports = mongoose.model('blogs', Schema)