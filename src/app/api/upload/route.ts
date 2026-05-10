import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { fileBase64, password } = await req.json();

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!fileBase64) {
      return NextResponse.json({ success: false, error: 'No file' }, { status: 400 });
    }

    // Resource type 'auto' tells cloudinary to auto detect image/video/raw
    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: 'aesthetic-promotions',
      resource_type: 'auto' 
    });

    return NextResponse.json({ 
      success: true, 
      secure_url: uploadResponse.secure_url,
      mediaType: uploadResponse.resource_type // 'image' or 'video'
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
