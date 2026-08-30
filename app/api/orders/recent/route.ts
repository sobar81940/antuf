import dbConnect from "@/utils/dbConnect";
import Order from '@/models/order';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get limit from query params (default 3)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 3;

    // Fetch recent orders with populated user and course info
    const orders = await Order.find()
      .populate('userId', 'fullName name email')
      .populate('courseId', 'title')
      .select('_id userId courseId amount status createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders: orders,
    });
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch recent orders',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
