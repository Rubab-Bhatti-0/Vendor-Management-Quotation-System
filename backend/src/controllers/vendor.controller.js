const vendorModel=require('../models/vendor.model')

const createVendor=async(req,res,next)=>{
    try {
        const {vendorName, companyName, email, contactNumber, businessAddress} = req.body;
        const mappedData = {
            name: vendorName || req.body.name,
            company: companyName || req.body.company,
            email: email,
            contact: contactNumber || req.body.contact,
            address: businessAddress || req.body.address
        };

        const isVendorExist=await vendorModel.findOne({email});
        if(isVendorExist){
            return res.status(209).json({
                message:"vendor already exists"
            })
        }
        const v=await vendorModel.create(mappedData)
        return res.status(201).json({
            message: "vendor created successfully!",
            data: v
        })
    } catch (error) {
        next(error)
    }
}

const viewAllVendor=async(req,res,next)=>{
    try {
        const { search } = req.query;
        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { company: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }
        const vendors = await vendorModel.find(filter).sort({ createdAt: -1 });
        res.status(200).json({
            message: "All vendors are: ",
            data: vendors
        })
    } catch (err) {
        next(err);
    }
}

const updateVendor=async(req,res,next)=>{
    try {
        const id=req.params.id;
        const {vendorName, companyName, email, contactNumber, businessAddress} = req.body;
        const mappedData = {
            name: vendorName || req.body.name,
            company: companyName || req.body.company,
            email: email,
            contact: contactNumber || req.body.contact,
            address: businessAddress || req.body.address
        };
        const v=await vendorModel.findByIdAndUpdate(id, mappedData, { new: true });
        if(!v){
            return res.status(404).json({
                message:"vendor not found"
            })
        }
        res.status(200).json({
            message:"vendor updated successfully!",
            data: v
        })
    } catch (error) {
        next(error)
    }
}

const searchVendorByID=async(req,res,next)=>{
    try {
        const id=req.params.id;
        const v=await vendorModel.findById(id);
        if(!v){
            return res.status(404).json({
                message:"vendor not found"
            })
        }
        res.status(200).json({
            message:"vendor found",
            data: v
        })
    } catch (error) {
        next(error)
    }
}

const delVendor=async(req,res,next)=>{
    try {
        const id=req.params.id;
        const v=await vendorModel.findByIdAndDelete(id);
        if(!v){
            return res.status(404).json({
                message:"vendor not found"
            })
        }
        res.status(200).json({
            message:"vendor deleted successfully!"
        })
    } catch (err) {
        next(err);
    }
}

module.exports={createVendor,delVendor,updateVendor,searchVendorByID,viewAllVendor}
