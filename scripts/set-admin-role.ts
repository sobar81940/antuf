// Set admin role
import mongoose from "mongoose";

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/antuf';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✓ Connected to MongoDB');

    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    const adminEmail = 'admin@antuf.org';
    
    // Find the admin user
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log('❌ Admin user not found:', adminEmail);
      process.exit(1);
    }

    console.log('Current admin user:', {
      email: admin.email,
      role: admin.role,
      isAdmin: admin.isAdmin,
    });

    // Update to admin role
    const updated = await User.findByIdAndUpdate(
      admin._id,
      { 
        $set: { 
          role: 'admin',
          isAdmin: true 
        } 
      },
      { new: true }
    );

    console.log('\n✓ Admin role updated:', {
      email: updated.email,
      role: updated.role,
      isAdmin: updated.isAdmin,
    });

    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
