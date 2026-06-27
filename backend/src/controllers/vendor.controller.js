const vendor=require('../models/vendor.model')

const createVendor=async(req,res,next)=>{
    try{
        const{ name, email}=req.body
        const isVendorExist=await vendor.findOne({
            $or:[
                {name},
                {email}
            ]
        })
        if(isVendorExist){
            return res.status(209).json({
                message:"Vendor already exists"
            })
        }
    const v=await vendor.create(req.body)
     if(!v){
            return res.status(404).json({
                message:"Not update "
            });
        }
    return res.status(201).json({
        message: "vendor created successfully!",
        v
    })

    }catch(err){
        next(err)
    }

}

const viewAllVendor=async(req,res,next)=>{
    try {
        const {search}=req.query;
        const filter =search ? {
            $or:[
                { name:{$regex : search , $options: i}},
                {company:{$regex:search, $options:i}},
                {email:{$regex:search,$options:i}}
            ]
        }:{};
        const v= await vendor.find(filter).sort({createdAt:-1});
        res.status(200).json({
            message:"Vendors found",
            v
        })
        
    } catch (error) {
        next(error)
        
    }


}

const updateVendor=async(req,res,next)=>{

    try{
        const{ name, email}=req.body
        const isVendorExist=await vendor.findOne({
            $or:[
                {contact},
                {email}
            ]
        })
        if(isVendorExist){
            return res.status(209).json({
                message:"Vendor already exists"
            })
        }
        const id=req.params.id;
        const v=await vendor.findByIdAndUpdate(id,req.body);
        if(!v){
            return res.status(404).json({
                message:"Not update "
            });
        }
        res.status(200).json({
                message:" update "
            })


    }catch(err){
        next(err)
    }


}

const delVendor=async(req,res,next)=>{

    try{
        const id=req.params.id
        const v= await vendor.findByIdAndDelete(id,req.body)
        if(!v){
           return res.status(404).json({
                message:"Error in deletion the vendor",
            })
        }
        res.status(200).json({
            message:"vendor deleted successfully!"
        })
    }catch(err){
        next(err)
    }


}

const searchVendorByID=async(req,res,next)=>{
    try {
        const id=req.params.id;
        const v=await vendor.findById(id);
        if(!v){
            return res.status(404).json({
                message:"Vendor not found"
            })
        }
        res.status(200).json({
            message:"Vendors found",
            v
        })

    } catch (error) {
        next(error)
        
    }

}

module.exports={createVendor,delVendor,updateVendor,searchVendorByID,viewAllVendor}