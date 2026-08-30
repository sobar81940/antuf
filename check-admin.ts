#!/usr/bin/env node
/**
 * Admin Login Diagnostic Script
 * 
 * This script helps diagnose login issues by:
 * 1. Checking database connection
 * 2. Listing all admin users
 * 3. Checking user status and credentials
 * 
 * Usage: node check-admin.js
 */

// Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');

// Import models and utilities
async function checkAdminUsers() {
    try {
        console.log('🔍 Starting Admin Login Diagnostics...\n');

        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error('❌ MONGODB_URI environment variable not set');
            process.exit(1);
        }

        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected successfully\n');

        // Get User model
        const User = mongoose.model('User') || require('./models/user.js').default;

        // Count total users
        const totalUsers = await User.countDocuments();
        console.log(`📊 Total users in database: ${totalUsers}\n`);

        // Find all admin users
        const adminUsers = await User.find({ role: 'admin' }).lean();
        console.log(`👑 Admin users found: ${adminUsers.length}\n`);

        if (adminUsers.length === 0) {
            console.log('⚠️  No admin users found!');
            console.log('💡 You need to create an admin user using /api/setup-admin endpoint\n');
        } else {
            console.log('Admin user details:');
            console.log('─'.repeat(80));

            adminUsers.forEach((user, index) => {
                console.log(`\n${index + 1}. ${user.name || 'No name'}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Active: ${user.isActive !== false ? '✅ Yes' : '❌ No (DEACTIVATED)'}`);
                console.log(`   Has Password: ${user.password ? '✅ Yes' : '❌ No (OAuth only)'}`);
                console.log(`   Provider: ${user.provider || 'credentials'}`);
                console.log(`   Created: ${user.createdAt || 'Unknown'}`);
            });

            console.log('\n' + '─'.repeat(80));
        }

        // Check for users with credentials provider
        const credentialUsers = await User.find({
            $or: [
                { provider: 'credentials' },
                { provider: { $exists: false } }
            ],
            password: { $exists: true, $ne: null }
        }).countDocuments();

        console.log(`\n🔐 Users with password credentials: ${credentialUsers}`);

        // Check environment variables
        console.log('\n🔧 Environment Check:');
        console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing'}`);
        console.log(`   GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '⚠️  Not set'}`);
        console.log(`   GITHUB_CLIENT_ID: ${process.env.GITHUB_CLIENT_ID ? '✅ Set' : '⚠️  Not set'}`);

        console.log('\n✅ Diagnostic complete!\n');

    } catch (error) {
        console.error('\n❌ Error during diagnostics:', error.message);
        console.error(error.stack);
    } finally {
        await mongoose.disconnect();
        console.log('📡 Disconnected from MongoDB');
    }
}

// Run the diagnostic
checkAdminUsers();
