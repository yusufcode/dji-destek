const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    productName: {type:String},
    productUrl: {type:String},
    productDetails: {type:String},
    productImages: [
        {
            productImage: {type:String}
        }
    ],
    productOldPrice: {type:Number},
    productCurrentPrice: {type:Number},
    productStatus: {type:Boolean},
    productGeneralStatus: {type:Boolean},
    productDroneSerial: {type:Boolean},
    productDroneModel: {type:Boolean},
    productDroneAltModel: {type:Boolean},
    productSeoText: {type:String},
    categoryName: {type:String},
    categoryUrl: {type:String},
    pageTitle: {type:String},
    pageDescription: {type:String},
    pageKeywords: {type:String},
    pageAuthor: {type:String}
}, {timestamps:true})

module.exports = mongoose.model('products', Schema)