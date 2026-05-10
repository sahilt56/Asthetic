import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Settings } from '@/models/Settings';

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await Settings.find({});
    const settingsMap = settings.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    return NextResponse.json(settingsMap);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { key, value } = await req.json();
    if (!key || !value) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    await connectToDatabase();
    const updated = await Settings.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true, updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save setting" }, { status: 500 });
  }
}
