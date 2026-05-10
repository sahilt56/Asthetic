import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { password } = await req.json();

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const resolvedParams = await params;
    const productId = resolvedParams.id;
    
    // Find the product first to get the Cloudinary public_id if we wanted to delete the image too
    // For now, we'll just delete from DB to be safe, but ideally you delete from Cloudinary too.
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    await Product.findByIdAndDelete(productId);

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { password, title, price, link, description, aboutText, imageBase64 } = await req.json();

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const resolvedParams = await params;
    const productId = resolvedParams.id;
    
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const updateData: any = {
      title,
      price,
      link,
      description,
      aboutText
    };

    // If user uploaded a new image, update it via Cloudinary
    if (imageBase64 && imageBase64.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: 'aesthetic-finds',
      });
      updateData.imageUrl = uploadResponse.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}
