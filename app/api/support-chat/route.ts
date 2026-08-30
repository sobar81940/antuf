import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from "@/utils/dbConnect";
import ChatRoom from '@/models/chat';

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession();
    
    const { message, guestName, guestEmail, userId } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create or find existing support chat
    let chat;
    
    if (userId) {
      // Logged-in user
      chat = await ChatRoom.findOne({
        userId,
        status: { $in: ['active', 'pending'] }
      }).sort({ createdAt: -1 });

      if (!chat) {
        chat = new ChatRoom({
          userId,
          userName: session?.user?.name,
          userEmail: session?.user?.email,
          subject: 'Support Request',
          category: 'support',
          priority: 'medium',
          status: 'active',
          messages: []
        });
      }
    } else {
      // Guest user
      if (!guestEmail || !guestName) {
        return NextResponse.json(
          { error: 'Guest name and email are required' },
          { status: 400 }
        );
      }

      chat = await ChatRoom.findOne({
        userEmail: guestEmail,
        status: { $in: ['active', 'pending'] }
      }).sort({ createdAt: -1 });

      if (!chat) {
        chat = new ChatRoom({
          userName: guestName,
          userEmail: guestEmail,
          subject: 'Guest Support Request',
          category: 'support',
          priority: 'medium',
          status: 'active',
          messages: []
        });
      }
    }

    // Add message
    chat.messages.push({
      content: message,
      senderRole: userId ? 'user' : 'guest',
      senderName: userId ? session?.user?.name : guestName,
      timestamp: new Date()
    });

    await chat.save();

    return NextResponse.json({
      success: true,
      chatId: chat._id,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Error in support chat:', error);
    return NextResponse.json(
      { error: 'Failed to send message', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch support chat messages
export async function GET(req) {
  try {
    await dbConnect();
    const session = await getServerSession();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const userId = session?.user?.id;

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'User authentication or email required' },
        { status: 401 }
      );
    }

    let chat;
    if (userId) {
      chat = await ChatRoom.findOne({
        userId,
        status: { $in: ['active', 'pending'] }
      }).sort({ createdAt: -1 });
    } else if (email) {
      chat = await ChatRoom.findOne({
        userEmail: email,
        status: { $in: ['active', 'pending'] }
      }).sort({ createdAt: -1 });
    }

    return NextResponse.json({
      success: true,
      chat: chat || null,
      messages: chat?.messages || []
    });

  } catch (error) {
    console.error('Error fetching support chat:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
