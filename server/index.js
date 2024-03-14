const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config(); // Directly call .config() here.
const cors = require("cors");
const connectDB = require('./config/db');
// Import routes
const authRoutes = require("./routes/auth");
const invoiceRoutes = require("./routes/invoices");
const PORT = process.env.PORT || 3100;
const app = express();
// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
// Enable CORS for all routes with specific options
// Enable CORS for all routes with unrestricted access
app.use(cors({
    origin: function(origin, callback){
        // Here you can include logic to allow/restrict origins
        if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)
        return callback(null, origin); // Reflect the request origin, as defined by the 'origin' parameter
    },
    credentials: true, // Reflecting the request origin implies credentials are allowed
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "*",
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Static files
app.use(express.static("./public"));

// API Health Check
app.get("/health", (req, res) => {
    res.json({message: "All good!"});
});

// Use Routes
app.use("/api/", authRoutes);
app.use("/api/", invoiceRoutes);
// app.use('/api/', taskRoutes); // Slight change for clarity in route prefixing

// Start Server
app.listen(PORT, () => {
    connectDB().then(() => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log('MongoDB connected...');
    }).catch((err) => {
        console.error('Database connection failed', err.message);
        process.exit(1);
    });
});
