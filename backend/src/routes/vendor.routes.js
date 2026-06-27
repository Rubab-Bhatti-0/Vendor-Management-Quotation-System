const express=require('express')
const router=express.Router();

const{ createVendor,viewAllVendor,updateVendor,delVendor,searchVendorByID}=require('../controllers/vendor.controller')

router.post('/create',createVendor);
router.put('/update/:id',updateVendor);
router.delete('/delete/:id',delVendor);
router.get('/search/:id',searchVendorByID);
router.get('/viewAll',viewAllVendor)

module.exports=router