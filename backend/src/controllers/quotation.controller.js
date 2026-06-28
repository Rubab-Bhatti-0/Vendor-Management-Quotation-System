const quotation=require('../models/quotation.model')
const vendorModel=require('../models/vendor.model')

const createQuotation=async(req,res,next)=>{

    try {
        const{ title,vendorReference}=req.body
                const isQuotationExist=await quotation.findOne({
                    $and:[
                        {title},
                        {vendorReference}
                    ]
                })
                if(isQuotationExist){
                    return res.status(209).json({
                        message:"Quotation already exists"
                    })
                }
            const v=await quotation.create(req.body)
            return res.status(201).json({
                message: "Quotation created successfully!",
                data: v
            })
        
    } catch (error) {
        next(error)
        
    }


}

const updateStatus=async(req,res,next)=>{
    try {
        const id=req.params.id;
        const v=await quotation.findByIdAndUpdate(id,req.body, { new: true });
        if(!v){
        return res.status(404).json({
        message:"Not update "
     });
}
        res.status(200).json({
         message:" update ",
         data: v
                    })
        
        
    } catch (error) {
        next(error)
    }



}
const getAllQuotation=async(req,res,next)=>{
      try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const quotations = await quotation.find(filter)
      .populate('vendorReference', 'name company email vendorName companyName')
      .sort({ createdAt: -1 });
    res.status(200).json({
         message:" All Quotations are: ", data: quotations })
    
  } catch (err) { next(err); }
};


const getQuotationByID=async(req,res,next)=>{
    try {
            const id=req.params.id;
            const v=await quotation.findById(id).populate('vendorReference');
            if(!v){
                return res.status(404).json({
                    message:"quotation not found"
                })
            }
            res.status(200).json({
                message:"Quotation found",
                data: v
            })
    
        } catch (error) {
            next(error)
            
        }


}
const compareQuotation = async (req, res, next) => {
  try {
    const quotations = await quotation
      .find()
      .populate('vendorReference', 'name company email vendorName companyName')
      .sort({ amount: 1 });

    const groups = {};
    quotations.forEach(q => {
      if (!groups[q.title]) groups[q.title] = [];
      groups[q.title].push(q);
    });

    const result = Object.entries(groups).map(([title, items]) => ({
      title,
      quotations: items.map((q, i) => ({
        ...q.toObject(),
        isCheapest: i === 0   
      }))
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const delQuotation=async(req,res,next)=>{
    try{
            const id=req.params.id
            const v= await quotation.findByIdAndDelete(id)
            if(!v){
               return res.status(404).json({
                    message:"Error in deletion the quotation",
                })
            }
            res.status(200).json({
                message:"quotation deleted successfully!"
            })
        }catch(err){
            next(err)
        }

}

module.exports={createQuotation,updateStatus,getAllQuotation,getQuotationByID,compareQuotation,delQuotation}
