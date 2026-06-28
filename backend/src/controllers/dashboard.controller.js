const vendorModel=require('../models/vendor.model')
const quotationModel=require('../models/quotation.model')

const getStats= async (req,res, next)=>{
   try{
    const [ totalVendors, activeQuot,pendingQuot,approvedQuot,recentQuotations ] = await Promise.all([
        vendorModel.countDocuments(),
        quotationModel.countDocuments({status:"active"}),
        quotationModel.countDocuments({status:"pending"}),
        quotationModel.countDocuments({status:"approved"}),
        quotationModel.find().populate('vendorReference', 'name company vendorName companyName').sort({createdAt:-1}).limit(5)]);
        res.status(200).json({
            message: "Data fetched successfully!",
            data: {totalVendors,activeQuot,pendingQuot,approvedQuot,recentQuotations}
        
        })
    


}catch(error){
    next(error)
}

}

module.exports=getStats
