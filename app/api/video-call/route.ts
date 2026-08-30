import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Helper function to sanitize user ID for GetStream
// GetStream only allows: a-z, 0-9, @, _, and -
const sanitizeUserId = (userId) => {
  if (!userId) return 'user_' + Date.now();
  
  // Convert to string and sanitize
  let sanitized = String(userId)
    .toLowerCase()
    .replace(/[^a-z0-9@_-]/g, '_'); // Replace invalid chars with underscore
  
  // Ensure it doesn't start with a number (optional safety check)
  if (/^\d/.test(sanitized)) {
    sanitized = 'user_' + sanitized;
  }
  
  // Ensure minimum length
  if (sanitized.length < 3) {
    sanitized = 'user_' + sanitized + '_' + Date.now();
  }
  
  return sanitized;
};

export async function POST(req) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { callId, callType = 'default', userId: clientUserId } = await req.json();

    // GetStream API credentials (add these to your .env file)
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'GetStream API credentials not configured' }, 
        { status: 500 }
      );
    }

    // Use sanitized user ID from client, or create one from session
    const rawUserId = clientUserId || session.user.id || session.user.email || session.user.name;
    const userId = sanitizeUserId(rawUserId);
    const userName = session.user.name || 'User';

    // Return configuration for client-side initialization
    // The StreamVideoClient should be initialized on the client side, not server side
    return NextResponse.json({
      success: true,
      apiKey,
      userId,
      callId,
      callType,
      user: {
        id: userId,
        name: userName,
        image: session.user.image,
      },
    });
  } catch (error) {
    console.error('Error creating video call:', error);
    return NextResponse.json(
      { error: 'Failed to create video call', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const callId = searchParams.get('callId');

    if (!callId) {
      return NextResponse.json({ error: 'Call ID required' }, { status: 400 });
    }

    // Return call information
    return NextResponse.json({
      success: true,
      callId,
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY,
    });
  } catch (error) {
    console.error('Error fetching video call:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video call' },
      { status: 500 }
    );
  }
}
