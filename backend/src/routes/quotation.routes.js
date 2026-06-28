const express = require('express');
const router = express.Router();
const { createQuotation, updateStatus, getAllQuotation, getQuotationByID, compareQuotation, delQuotation } = require('../controllers/quotation.controller');

router.get('/compare', compareQuotation);
router.get('/', getAllQuotation);
router.post('/', createQuotation);
router.get('/:id', getQuotationByID);
router.put('/:id', updateStatus);
router.delete('/:id', delQuotation);

module.exports = router;
