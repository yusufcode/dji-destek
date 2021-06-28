const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    categoryName: {type:String},
    categoryUrl: {type:String},
    categoryDetails: {type:String},
    categoryImage: {type:String},
    categoryStatus: {type:Boolean},
    categoryGeneralStatus: {type:Boolean},
    categorySeoText: {type:String}
}, {timestamps:true})

module.exports = mongoose.model('categories', Schema)