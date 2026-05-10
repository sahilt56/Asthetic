import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Notice } from '@/models/Notice';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const notices = await Notice.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: notices });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Load failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, text, intervalSeconds, durationSeconds, link, imageUrl, type, mediaType } = body;

    await connectToDatabase();

    if (action === 'delete') {
      await Notice.findByIdAndDelete(id);
      return NextResponse.json({ success: true });
    }

    // Create or Update
    if (id) {
      const updated = await Notice.findByIdAndUpdate(
        id, 
        { text, intervalSeconds, durationSeconds, link, imageUrl, type, mediaType },
        { new: true, returnDocument: 'after' }
      );
      return NextResponse.json({ success: true, data: updated });
    } else {
      const created = await Notice.create({ text, intervalSeconds, durationSeconds, link, imageUrl, type, mediaType });
      return NextResponse.json({ success: true, data: created });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Operation failed" }, { status: 500 });
  }
}
