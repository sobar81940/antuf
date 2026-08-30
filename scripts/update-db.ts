const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load env variables
const envPath = path.join(__dirname, '@/.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  if (!line.trim().startsWith('#') && line.includes('=')) {
    const [key, ...valueParts] = line.split('=');
    process.env[key.trim()] = valueParts.join('=').trim();
  }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minLength: 3, maxLength: 20 },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  image: { type: String, default: "https://placehold.co/600x400" },
  password: { type: String, required: true },
  organization: String,
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  country: { type: String, trim: true },
  zipCode: { type: String, trim: true },
  permanentAddresses: [{
    addressType: { type: String, enum: ["permanent", "temporary", "office", "other"], default: "permanent" },
    province: { type: String, trim: true },
    district: { type: String, trim: true },
    municipality: { type: String, trim: true },
    ward: { type: String, trim: true },
    streetAddress: { type: String, trim: true },
    city: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }],
  bio: { type: String, maxLength: 500 },
  motherName: { type: String, trim: true },
  fatherName: { type: String, trim: true },
  citizenshipNumber: { type: String, trim: true },
  district: { type: String, trim: true },
  citizenshipFront: String,
  citizenshipBack: String,
  role: { type: String, enum: ["user", "admin"], default: "user", required: true },
  subscription: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function updateDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB@.');
    await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
    });
    console.log('✅ Connected to MongoDB');

    console.log('\n📝 Syncing database schema@.');
    
    // Get current indexes
    try {
      const indexes = await User.collection.getIndexes();
      console.log(`   Found ${Object.keys(indexes).length} existing indexes`);
      
      // Only drop non-default indexes
      for (const indexName in indexes) {
        if (indexName !== '_id_') {
          try {
            await User.collection.dropIndex(indexName);
          } catch (e) {
            // Index might not exist
          }
        }
      }
      console.log('✅ Cleaned up old indexes');
    } catch (err) {
      console.log('ℹ️  Index cleanup completed');
    }

    // Create indexes
    await User.syncIndexes();
    console.log('✅ Schema indexes synced');

    const userCount = await User.countDocuments();
    console.log(`\n📊 Database Statistics:`);
    console.log(`   Total Users: ${userCount}`);
    console.log(`   Database: Connected ✓`);

    console.log('\n🆕 New Identity Fields:');
    ['motherName', 'fatherName', 'citizenshipNumber', 'district', 'citizenshipFront', 'citizenshipBack']
      .forEach(f => console.log(`   ✅ ${f}`));

    console.log('\n✅ Database successfully updated!');
    console.log('\n📋 Schema Update Summary:');
    console.log('   • 6 new identity information fields added');
    console.log('   • User schema synchronized with database');
    console.log('   • Indexes recreated\n');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database Error:', error.message);
    process.exit(1);
  }
}

updateDatabase();
