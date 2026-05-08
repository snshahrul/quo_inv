const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', quotationController.createQuotation);
router.get('/', quotationController.getQuotations);
router.get('/:id', quotationController.getQuotation);
router.put('/:id', quotationController.updateQuotation);
router.delete('/:id', quotationController.deleteQuotation);
router.post('/:id/send-email', quotationController.sendQuotationEmail);
router.post('/:id/convert-to-invoice', quotationController.convertToInvoice);

module.exports = router;