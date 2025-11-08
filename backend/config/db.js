import mongoose from 'mongoose';
import { config } from 'dotenv';
config();


const MONGODB_URI = process.env.MONGODB_URI;

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI not defined in environment variables');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {

    });
  }

try {
    cached.conn = await cached.promise;
} 
catch (e) {
    // If connection fails, reset the promise so a new attempt can be made
    cached.promise = null;
    throw e;
}
  return cached.conn;
}
