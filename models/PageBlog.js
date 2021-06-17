const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    blogColumnType: {type:String},
    blogMobileType: {type:String}
})

module.exports = mongoose.model('pageblog', Schema)