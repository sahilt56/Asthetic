import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  price?: string;
  imageUrl: string;
  link: string;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the product'],
  },
  price: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL for the product'],
  },
  link: {
    type: String,
    required: [true, 'Please provide an affiliate link for the product'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
