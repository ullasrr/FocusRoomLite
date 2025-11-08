import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Note', noteSchema)