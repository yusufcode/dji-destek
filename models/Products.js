const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    categoryName: {type:String},
    categoryUrl: {type:String},
    productName: {type:String},
    productUrl: {type:String},
    productDetails: {type:String},
    productImage: {type:String},
    productPrice: {type:String},
    productStatus: {type:Boolean},
    productGeneralStatus: {type:Boolean},
    productSeoText: {type:String}
}, {timestamps:true})

module.exports = mongoose.model('products', Schema)