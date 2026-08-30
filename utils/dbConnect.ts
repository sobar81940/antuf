// import mongoose from "mongoose";

// const dbConnect = async () => {
//   if (mongoose.connection.readyState >= 1) {
//     console.log("[DB] Already connected");
//     return;
//   }
  
//   try {
//     const dbUrl = process.env.DB_URL || process.env.MONGODB_URI;
    
//     if (!dbUrl) {
//       const error = "Database URL not provided. Set DB_URL or MONGODB_URI environment variable.";
//       console.error("[DB] " + error);
//       throw new Error(error);
//     }
    
//     console.log("[DB] Connecting to database...");
//     console.log("[DB] Database host:", dbUrl.split('@')[1] || 'unknown');
    
//     await mongoose.connect(dbUrl, { dbName: "antuf" });
//     console.log("[DB] Connected successfully");
//   } catch (error) {
//     console.error("[DB] Connection error:", {
//       message: error.message,
//       name: error.name,
//       hasDbUrl: !!process.env.DB_URL,
//       hasMongUri: !!process.env.MONGODB_URI,
//     });
//     throw error;
//   }
// };

// export default dbConnect;

import mongoose from "mongoose";

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  try {
    const dbUrl = process.env.DB_URL || process.env.MONGODB_URI;
    
    if (!dbUrl) {
      throw new Error("Database URL not provided. Please set DB_URL or MONGODB_URI environment variable.");
    }
    
    console.log("Connecting to database...");
    await mongoose.connect(dbUrl, { dbName: "antuf" });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

export default dbConnect;