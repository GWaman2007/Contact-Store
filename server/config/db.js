const dns = require('dns');

// Fallback to Google & Cloudflare DNS to ensure reliable MongoDB Atlas SRV resolution on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Continue with default system DNS if permission fails
}

const mongoose = require('mongoose');

// Connect to MongoDB using the connection string from environment variables
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/contact_store';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[Database Error] Connection failed: ${err.message}`);
    // If it was a querySrv error, try forcing DNS servers once more and retry
    if (err.message && err.message.includes('querySrv')) {
      console.log('[Database] Retrying MongoDB Atlas connection with Google DNS...');
      try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (retryErr) {
        console.error(`[Database Error] Retry failed: ${retryErr.message}`);
      }
    }
    process.exit(1);
  }
};

module.exports = connectDB;
