const getStats=require('../controllers/dashboard.controller')

const express=require ('express')
const router=express.Router()

router.get('/',getStats)

module.exports=router