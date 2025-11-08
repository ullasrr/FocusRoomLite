import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  plan: { type: String, default: 'free' }, // 'free' or 'pro'
});

export default mongoose.model('User', userSchema);
