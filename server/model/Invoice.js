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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
    pdfFileId: { type: String }, // Field to store the PDF file identifier from GridFS
    invoiceHtmlString: String // New field for storing the invoice HTML string
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;
