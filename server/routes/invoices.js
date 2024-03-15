const express = require('express');
const router = express.Router();
const Invoice = require('./../model/Invoice');
const isAuthenticated = require('../middlewares/isAuthenticated');
const moment = require('moment'); // For date manipulation
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const PDFDocument = require("pdfkit");
// POST route to save an array of products as an invoice
router.post('/invoices', isAuthenticated, async (req, res) => {
    try {
        // Assuming req.body.pdfBase64 contains your PDF file as a Base64 string
        // and req.body.products contains the array of products
        const newInvoice = new Invoice({
            products: req.body.products,
            createdBy: req.user._id, // Assuming req.user is populated by isAuthenticated middleware
            pdfBase64: req.body.pdfBase64, // Storing the PDF as a Base64 string
        });
        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        console.error('Error saving invoice:', error);
        res.status(400).json({ message: error.message });
    }
});

router.get('/invoices', isAuthenticated, async (req, res) => {
    try {
        const invoices = await Invoice.find({ createdBy: req.user._id });
        if (!invoices.length) {
            return res.status(404).send('No invoices found for the user');
        }
        res.json(invoices);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/invoices/download/:invoiceId', isAuthenticated, async (req, res) => {
    try {
        const invoiceId = req.params.invoiceId;
        // Fetch the invoice directly using Mongoose
        const invoiceData = await Invoice.findById(invoiceId);

        if (!invoiceData) {
            return res.status(404).send('Invoice not found');
        }

        // Assuming invoiceData.pdfBase64 contains your PDF file as a Base64 string
        if (!invoiceData.pdfBase64) {
            return res.status(404).send('No PDF found for this invoice');
        }

        // Convert Base64 string to a Buffer
        const pdfBuffer = Buffer.from(invoiceData.pdfBase64, 'base64');

        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment;filename=invoice-${invoiceId}.pdf`);

        // Send the PDF Buffer to the client
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error serving invoice PDF:', error);
        res.status(500).send('Error serving invoice PDF');
    }
});

module.exports = router;
