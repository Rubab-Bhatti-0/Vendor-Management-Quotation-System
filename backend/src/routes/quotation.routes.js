const express=require('express')
const router=express.Router()

const {delQuotation,createQuotation,updateStatus,getAllQuotation,getQuotationByID,compareQuotation}=require('../controllers/quotation.controller')

router.get('/getAll',getAllQuotation);
router.post('/create',createQuotation);
router.get('/view/:id',getQuotationByID);
router.put('/update/:id',updateStatus);
router.get('/compare',compareQuotation)
router.delete('/delete/:id',delQuotation)

module.exports=router


