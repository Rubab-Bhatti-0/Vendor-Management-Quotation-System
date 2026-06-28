const express = require('express');
const router = express.Router();
const { createVendor, delVendor, updateVendor, searchVendorByID, viewAllVendor } = require('../controllers/vendor.controller');

router.post('/', createVendor);
router.put('/:id', updateVendor);
router.delete('/:id', delVendor);
router.get('/:id', searchVendorByID);
router.get('/', viewAllVendor);

module.exports = router;
