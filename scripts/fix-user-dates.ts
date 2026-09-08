import mongoose from "mongoose";
import bcrypt from "bcrypt";

// MongoDB URI from environment (Railway production DB)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/antuf';

async function fixUserDates() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Find all users to see what's in the database
    const allUsers = await usersCollection.find({}).toArray();
    console.log('Total users found:', allUsers.length);
    console.log('Users:', allUsers.map(u => ({ email: u.email, name: u.name, role: u.role })));

    // Find users with malformed date objects
    const users = await usersCollection.find({
      email: 'admin@antuf.org'
    }).toArray();

    console.log('Found admin user:', users[0]);

    if (users.length > 0) {
      const user = users[0];
      
      // Fix createdAt if it's an object
      let createdAt = user.createdAt;
      if (createdAt && typeof createdAt === 'object' && createdAt.$date) {
        createdAt = new Date(createdAt.$date);
      } else if (typeof createdAt === 'string') {
        createdAt = new Date(createdAt);
      } else if (!createdAt) {
        createdAt = new Date();
      }

      // Fix updatedAt if it's an object
      let updatedAt = user.updatedAt;
      if (updatedAt && typeof updatedAt === 'object' && updatedAt.$date) {
        updatedAt = new Date(updatedAt.$date);
      } else if (typeof updatedAt === 'string') {
        updatedAt = new Date(updatedAt);
      } else if (!updatedAt) {
        updatedAt = new Date();
      }

      // Update user with fixed dates and admin role
      const result = await usersCollection.updateOne(
        { email: 'admin@antuf.org' },
        {
          $set: {
            createdAt: createdAt,
            updatedAt: updatedAt,
            role: 'admin',
            isAdmin: true
          }
        }
      );

      console.log('Update result:', result);
      console.log('✅ User dates fixed and admin role set!');
    } else {
      console.log('❌ User admin@antuf.org not found');
      console.log('Creating new admin user...');
      
      // Create new admin user
      const hashedPassword = await bcrypt.hash('aasish', 10);
      
      const newUser = {
        email: 'admin@antuf.org',
        name: 'Admin',
        password: hashedPassword,
        role: 'admin',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await usersCollection.insertOne(newUser);
      console.log('✅ Admin user created successfully!');
      console.log('Email: admin@antuf.org');
      console.log('Password: aasish');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixUserDates();
