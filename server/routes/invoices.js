const express = require('express');
const router = express.Router();
const Invoice = require('./../model/Invoice');
const isAuthenticated = require('../middlewares/isAuthenticated');
const moment = require('moment'); // For date manipulation
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
// POST route to save an array of products as an invoice
router.post('/invoices', isAuthenticated, async (req, res) => {
    try {
        const newInvoice = new Invoice({
            products: req.body.products,
            createdBy: req.user._id // Set createdBy to the authenticated user's ID
        });
        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET route to retrieve all invoices created by the authenticated user
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

// Endpoint to generate PDF
router.post('/generate-pdf', async (req, res) => {
    try {
        const { htmlContent } = req.body; // Receive the HTML content from the frontend

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });
        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();

        // Send the PDF buffer to the client
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=invoice.pdf',
        });
        res.end(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

module.exports = router;
