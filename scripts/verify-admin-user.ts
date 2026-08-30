// Verify admin user
import mongoose from "mongoose";

// MongoDB URI from environment (Railway production DB)
const MONGODB_URI = 'mongodb://mongo:dwgsKvMSlfRFpdWFTVCkjhElACYSECDl@shuttle.proxy.rlwy.net:47163';

async function verifyAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Find the admin user
    const adminUser = await usersCollection.findOne({ email: 'admin@antuf.org' });
    
    if (adminUser) {
      console.log('✅ Admin user found!');
      console.log('Email:', adminUser.email);
      console.log('Name:', adminUser.name);
      console.log('Role:', adminUser.role);
      console.log('isAdmin:', adminUser.isAdmin);
      console.log('Password hash exists:', !!adminUser.password);
      console.log('Created:', adminUser.createdAt);
    } else {
      console.log('❌ Admin user not found');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verifyAdmin();
