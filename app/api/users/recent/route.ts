import dbConnect from "@/utils/dbConnect";
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get limit from query params (default 3)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 3;

    // Fetch recent users sorted by creation date (newest first)
    const users = await User.find()
      .select('_id fullName name email createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      count: users.length,
      users: users,
    });
  } catch (error) {
    console.error('Error fetching recent users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch recent users',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
