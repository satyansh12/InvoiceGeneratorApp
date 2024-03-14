// models/Invoice.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    rate: Number,
    total: Number
});

const InvoiceSchema = new mongoose.Schema({
    products: [ProductSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to User model
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;
