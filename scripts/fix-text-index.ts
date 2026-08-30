// Script to drop and recreate the text index with language-agnostic settings
import mongoose from "mongoose";

// MongoDB connection string - update if needed
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database';

async function fixTextIndex() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully');

    const db = mongoose.connection.db;
    const collection = db.collection('articles');

    // Get all indexes
    console.log('\nCurrent indexes:');
    const indexes = await collection.indexes();
    console.log(JSON.stringify(indexes, null, 2));

    // Find and drop text indexes
    for (const index of indexes) {
      if (index.key && Object.values(index.key).includes('text')) {
        console.log(`\nDropping text index: ${index.name}`);
        await collection.dropIndex(index.name);
        console.log('Index dropped successfully');
      }
    }

    console.log('\n✅ Old text index dropped successfully!');
    console.log('📝 Restart your application to recreate the index with new settings.');
    
    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixTextIndex();
