import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, price, link, imageBase64, password } = await req.json();

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!title || !link || !imageBase64) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: 'aesthetic-finds',
    });

    await connectToDatabase();
    
    const product = await Product.create({
      title,
      price,
      link,
      imageUrl: uploadResponse.secure_url,
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
