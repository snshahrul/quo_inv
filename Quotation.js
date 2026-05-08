const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  quotationNumber: {
    type: String,
    required: true,
    unique: true
  },
  client: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: String,
    phone: String,
    company: String
  },
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  subtotal: Number,
  tax: Number,
  taxRate: Number,
  total: Number,
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'accepted', 'declined', 'expired'],
    default: 'draft'
  },
  validUntil: Date,
  notes: String,
  terms: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quotation', quotationSchema);