#!/usr/bin/env node

/**
 * Google OAuth Debug Helper
 * This script helps diagnose Google OAuth issues
 * 
 * Usage: node debug-oauth.js
 */

import mongoose from "mongoose";
require("dotenv").config({ path: ".env.local" });

async function main() {
  console.log("\n========== GOOGLE OAUTH DEBUG ==========\n");

  // 1. Check Environment Variables
  console.log("1. Checking Environment Variables...");
  const required = [
    "DB_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ Missing environment variables:", missing);
    return;
  }
  console.log("✓ All required env vars present");
  console.log(`  - GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...`);
  console.log(`  - NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`);

  // 2. Test MongoDB Connection
  console.log("\n2. Testing MongoDB Connection...");
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✓ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    return;
  }

  // 3. Check User Collection
  console.log("\n3. Checking User Collection...");
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const hasUsers = collections.some((c) => c.name === "users");

    if (hasUsers) {
      console.log("✓ Users collection exists");

      const count = await db.collection("users").countDocuments();
      console.log(`  - Total users: ${count}`);

      // Get Google users
      const googleUsers = await db
        .collection("users")
        .find({ provider: "google" })
        .toArray();
      console.log(`  - Google OAuth users: ${googleUsers.length}`);

      if (googleUsers.length > 0) {
        console.log(`  - Sample Google user:`, {
          email: googleUsers[0].email,
          name: googleUsers[0].name,
          provider: googleUsers[0].provider,
          password: googleUsers[0].password,
        });
      }

      // Check for users with missing password
      const noPassword = await db
        .collection("users")
        .find({ password: null })
        .toArray();
      console.log(`  - Users with null password: ${noPassword.length}`);
    } else {
      console.log("⚠ Users collection not found");
    }
  } catch (error) {
    console.error("❌ Error checking users:", error.message);
  }

  // 4. User Schema Validation
  console.log("\n4. User Schema Validation...");
  try {
    const User = require("./models/user").default;
    const schema = User.schema;

    console.log("✓ User schema loaded");
    console.log(`  - Name: required=${schema.obj.name.required}, minLength=${schema.obj.name.minLength}`);
    console.log(`  - Email: required=${schema.obj.email.required}, unique=${schema.obj.email.unique}`);
    console.log(`  - Password: required=${schema.obj.password.required}, default=${schema.obj.password.default}`);
    console.log(`  - Provider: enum=${schema.obj.provider.enum.join(", ")}`);
  } catch (error) {
    console.error("❌ Error loading schema:", error.message);
  }

  // 5. Test User Creation
  console.log("\n5. Testing User Creation...");
  try {
    const User = require("./models/user").default;

    const testEmail = `test-oauth-${Date.now()}@gmail.com`;
    const testUser = new User({
      email: testEmail,
      name: "Test Google User",
      image: "https://example.com/photo.jpg",
      provider: "google",
      password: null,
    });

    await testUser.save();
    console.log("✓ Test user created successfully");
    console.log(`  - Email: ${testUser.email}`);
    console.log(`  - Provider: ${testUser.provider}`);

    // Clean up
    await User.deleteOne({ _id: testUser._id });
    console.log("✓ Test user cleaned up");
  } catch (error) {
    console.error("❌ Error creating test user:", error.message);
    if (error.errors) {
      console.error("  Validation errors:", error.errors);
    }
  }

  console.log("\n========== DEBUG COMPLETE ==========\n");
  await mongoose.disconnect();
}

main().catch(console.error);
