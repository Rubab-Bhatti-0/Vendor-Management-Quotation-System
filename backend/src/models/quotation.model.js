const mongoose=require('mongoose')

const quotationSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true

    },
    description:{
        type:String
    },
    vendorReference:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'vendor',
        required:true

    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now

    },
    status:{
        enum:['pending','active','approved','rejected'],
        default:'pending',
        type:String
        
    }
},{timestamps:true})


const quotationModel=mongoose.model('quotation',quotationSchema)

module.exports=quotationModel