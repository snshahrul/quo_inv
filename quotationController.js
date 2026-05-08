const Quotation = require('../models/Quotation');
const Invoice = require('../models/Invoice');
const { generateQuotationPDF } = require('../utils/pdfGenerator');
const { sendQuotationEmail } = require('../utils/emailService');

// Generate quotation number
const generateQuotationNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  const lastQuotation = await Quotation.findOne()
    .sort({ createdAt: -1 })
    .limit(1);
  
  let sequence = '001';
  if (lastQuotation && lastQuotation.quotationNumber) {
    const lastSequence = parseInt(lastQuotation.quotationNumber.split('-')[2]);
    sequence = String(lastSequence + 1).padStart(3, '0');
  }
  
  return `QUO-${year}${month}-${sequence}`;
};

exports.createQuotation = async (req, res) => {
  try {
    const quotationNumber = await generateQuotationNumber();
    const quotation = new Quotation({
      ...req.body,
      quotationNumber,
      user: req.user.id
    });
    
    await quotation.save();
    res.status(201).json(quotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    
    res.json({ message: 'Quotation deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendQuotationEmail = async (req, res) => {
  try {
    const quotation = await Quotation.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    
    // Get company info from request or use default
    const companyInfo = req.body.companyInfo || {
      name: 'Your Company',
      address: '123 Business Street',
      email: 'info@yourcompany.com',
      phone: '+1 234 567 890'
    };
    
    const pdfBuffer = await generateQuotationPDF(quotation, companyInfo);
    await sendQuotationEmail(quotation, pdfBuffer);
    
    quotation.status = 'sent';
    await quotation.save();
    
    res.json({ message: 'Quotation sent successfully', quotation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.convertToInvoice = async (req, res) => {
  try {
    const quotation = await Quotation.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    
    // Generate invoice number
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 }).limit(1);
    let sequence = '001';
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
      sequence = String(lastSequence + 1).padStart(3, '0');
    }
    
    const invoice = new Invoice({
      invoiceNumber: `INV-${year}${month}-${sequence}`,
      quotationNumber: quotation.quotationNumber,
      client: quotation.client,
      items: quotation.items,
      subtotal: quotation.subtotal,
      tax: quotation.tax,
      taxRate: quotation.taxRate,
      total: quotation.total,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      notes: quotation.notes,
      terms: quotation.terms,
      user: req.user.id
    });
    
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};