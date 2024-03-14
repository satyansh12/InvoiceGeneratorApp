const mongoose = require('mongoose');

/**
 * db.js configures and connects to the MongoDB database using Mongoose.
 * It's critical for setting up the database connection for the application.
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
}

module.exports = connectDB;