import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema({
  text: { type: String, default: '' },
  intervalSeconds: { type: Number, default: 60 }, // Time between appearances
  durationSeconds: { type: Number, default: 10 },  // How long it stays on screen
  link: { type: String, default: '' },              // Optional Promo Link
  imageUrl: { type: String, default: '' },         // Optional Product Mini Image / Video
  mediaType: { type: String, default: 'image' },   // 'image' or 'video'
  type: { type: String, enum: ['notice', 'billboard'], default: 'notice' } // Separation
}, { timestamps: true });
// Clear mongoose model cache during HMR to ensure schema updates (like removing 'required: true') take effect immediately.
delete mongoose.models.Notice;
export const Notice = mongoose.model('Notice', NoticeSchema);
