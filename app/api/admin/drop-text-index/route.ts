import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await dbConnect();
    
    const db = mongoose.connection.db;
    const collection = db.collection('articles');

    // Get all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    // Drop all text indexes
    let dropped = [];
    for (const index of indexes) {
      if (index.key && Object.values(index.key).includes('text')) {
        console.log(`Dropping text index: ${index.name}`);
        try {
          await collection.dropIndex(index.name);
          dropped.push(index.name);
        } catch (err) {
          console.error(`Error dropping ${index.name}:`, err.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Dropped ${dropped.length} text index(es)`,
      droppedIndexes: dropped,
      note: 'Please restart your application to recreate indexes with new settings'
    });
  } catch (error) {
    console.error('Error dropping indexes:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
