const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    page: {type:String},
    pageName: {type:String},
    title: {type:String},
    layout: {type:String},
    bodyClass: {type:String}
}, {timestamps:true})

module.exports = mongoose.model('pagesadmin', Schema)