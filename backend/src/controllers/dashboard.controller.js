const vendorModel=require('../models/vendor.model')
const quotationModel=require('../models/quotation.model')

const getStats= async (req,res, next)=>{
   try{
    const [ totatalVendors, activeQuot,PendingQuot,approvedQuot,recentAct ] = await Promise.all([
        vendorModel.countDocuments(),
        quotationModel.countDocuments({status:"active"}),
        quotationModel.countDocuments({status:"pending"}),
        quotationModel.countDocuments({status:"approved"}),
        vendorModel.find().sort({createdAt:-1}).limit(5)]);
        res.status(200).json({
            message: "Data fetched successfully!",
            data: {totatalVendors,activeQuot,PendingQuot,approvedQuot,recentAct}
        
        })
    


}catch(error){
    next(error)
}

}

module.exports=getStats