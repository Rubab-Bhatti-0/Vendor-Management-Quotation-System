const mongoose = require ('mongoose');


const vendorSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    contact:{
        type: String,
        required:true
    },
    address:{
        type:String,
        required:true
    }
},{timestamps:true})

const vendorModel=mongoose.model('vendor',vendorSchema)

module.exports= vendorModel
