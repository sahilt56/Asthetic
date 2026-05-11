import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (password === process.env.ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      // Set an explicit cookie that the layout server component can read securely
      response.cookies.set('admin_preview_active', 'true', {
        path: '/',
        httpOnly: false, // We'll let JS read it too if needed
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax',
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
