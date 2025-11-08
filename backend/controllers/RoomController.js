import Room from '../models/RoomModel.js';
import User from '../models/userModel.js'; 
import { v4 as uuidv4 } from 'uuid';
import connectToDB from '../config/db.js';

export const createRoom = async (req, res) => {
  try {
    await connectToDB();
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user && user.plan !== 'pro') {
      return res.status(403).json({ message: 'Only pro users can create rooms' });
    }

    if (!user) {
      console.log('User not found, allowing room creation for testing');
    }

    const roomId = uuidv4();
    const room = new Room({ roomId, createdBy: email });
    await room.save();

    res.status(200).json({ roomId, message: 'Room created successfully' });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
export const getRoom = async (req, res) => {
  try {
    await connectToDB();
    const room = await Room.findOne({ roomId: req.params.roomId });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    return res.status(200).json({ exists: true, room });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const validateRoom = async (roomId) => {
  await connectToDB();
  const room = await Room.findOne({ roomId });
  return !!room;
};
