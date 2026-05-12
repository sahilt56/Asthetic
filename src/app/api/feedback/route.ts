import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Feedback } from '@/models/Feedback';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const password = searchParams.get('password');

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: feedbacks });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, rating, country } = body;

    if (!name || !country || !message) {
      return NextResponse.json({ success: false, error: 'Name, Country and Message are required' }, { status: 400 });
    }

    await connectToDatabase();
    const feedback = await Feedback.create({
      name,
      country,
      email,
      message,
      rating,
    });

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Feedback creation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit feedback' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, password } = body;

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    await Feedback.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback delete error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete feedback' }, { status: 500 });
  }
}
