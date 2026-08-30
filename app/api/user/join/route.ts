import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';

export async function POST(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const data = await request.json();

    // Validate required fields
    if (!data.nameEnglish || !data.nameNepali || !data.dobNepali) {
      return NextResponse.json(
        { error: 'आवश्यक फिल्डहरू छुटेका छन् / Required fields are missing' },
        { status: 400 }
      );
    }

    if (!data.phone || !data.email) {
      return NextResponse.json(
        { error: 'सम्पर्क विवरण आवश्यक छ / Contact details are required' },
        { status: 400 }
      );
    }

    if (!data.occupation || !data.workplace) {
      return NextResponse.json(
        { error: 'कार्य विवरण आवश्यक छ / Work details are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser && existingUser.nameEnglish) {
      return NextResponse.json(
        { error: 'यो इमेल पहिले नै प्रयोगमा छ / Email already in use' },
        { status: 400 }
      );
    }

    // Create or update user with join information
    const user = await User.findOneAndUpdate(
      { email: data.email },
      {
        $set: {
          nameEnglish: data.nameEnglish,
          nameNepali: data.nameNepali,
          dobNepali: data.dobNepali,
          gender: data.gender,
          address: data.address,
          district: data.district,
          province: data.province,
          municipality: data.municipality,
          wardNo: data.wardNo,
          phone: data.phone,
          occupation: data.occupation,
          workplace: data.workplace,
          position: data.position,
          unionName: data.unionName,
          membershipNumber: data.membershipNumber,
          joinDate: new Date(),
          recommendations: data.recommendations,
          interests: data.interests,
          skills: data.skills,
          emergencyContact: data.emergencyContact,
          emergencyPhone: data.emergencyPhone,
        }
      },
      { new: true, upsert: false }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'प्रयोगकर्ता फेला परेन / User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'सफलतापूर्वक सबमिट भयो / Successfully submitted',
      user: {
        id: user._id,
        nameEnglish: user.nameEnglish,
        nameNepali: user.nameNepali,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Error in /api/user/join:', error);
    return NextResponse.json(
      { error: 'सर्भर त्रुटि / Server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        nameEnglish: user.nameEnglish,
        nameNepali: user.nameNepali,
        dobNepali: user.dobNepali,
        gender: user.gender,
        address: user.address,
        district: user.district,
        province: user.province,
        municipality: user.municipality,
        wardNo: user.wardNo,
        phone: user.phone,
        email: user.email,
        occupation: user.occupation,
        workplace: user.workplace,
        position: user.position,
        unionName: user.unionName,
        membershipNumber: user.membershipNumber,
        joinDate: user.joinDate,
        recommendations: user.recommendations,
        interests: user.interests,
        skills: user.skills,
        emergencyContact: user.emergencyContact,
        emergencyPhone: user.emergencyPhone,
      }
    });
  } catch (error) {
    console.error('Error in GET /api/user/join:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}