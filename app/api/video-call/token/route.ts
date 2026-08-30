import { StreamChat } from 'stream-chat';
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

    const { userId: clientUserId } = await req.json();

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'GetStream API credentials not configured' },
        { status: 500 }
      );
    }

    // Sanitize the client userId or use session userId
    const rawUserId = clientUserId || session.user.id || session.user.email || session.user.name;
    const userId = sanitizeUserId(rawUserId);
    
    console.log('Token generation for user:', {
      rawUserId,
      sanitizedUserId: userId,
      sessionUserId: session.user.id,
      sessionEmail: session.user.email,
    });

    // Create Stream Chat client to generate token
    const serverClient = StreamChat.getInstance(apiKey, apiSecret);
    
    // Generate token for the sanitized user ID
    const token = serverClient.createToken(userId);

    console.log('Token generated successfully for:', userId);

    return NextResponse.json({
      token,
      userId,
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token', details: error.message },
      { status: 500 }
    );
  }
}
