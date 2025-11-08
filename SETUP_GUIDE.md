# FocusRoomLite - Setup and Usage Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### 1. Backend Setup
```bash
cd backend
npm install
```

Create/update `.env` file with:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3001
```

Start the backend:
```bash
npm run dev
```

The backend should be running on `http://localhost:3001`

#### 2. Frontend Setup
```bash
cd frontend
npm install
```

The `.env.local` file should contain:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

Start the frontend:
```bash
npm run dev
```

The frontend should be running on `http://localhost:3000`

## 🎯 How It Works

### Creating a Room
1. Navigate to `http://localhost:3000/createroom`
2. Click "Create New Room" button
3. The system will:
   - Generate a unique room ID
   - Create a room in the database
   - Redirect you to the room page

### Joining a Room
1. Navigate to `http://localhost:3000/createroom`
2. Enter a Room ID in the "Join Existing Room" section
3. Click "Join Room"
4. You'll be connected to the room

### In the Room
Once in a room, you can:
- **See participants**: View your own video and remote participants
- **Control media**: Toggle audio and video on/off
- **Chat**: Send messages to other participants
- **Share Room ID**: Copy the room ID to share with others
- **Leave**: Click the red phone button to leave the room

## 🔧 Technical Details

### WebRTC Flow
1. User joins room via Socket.IO
2. Browser requests camera/microphone permissions
3. WebRTC peer connection is established
4. Offer/Answer exchange happens via Socket.IO
5. ICE candidates are exchanged for NAT traversal
6. Media streams are connected

### Socket.IO Events
- `joinRoom`: Join a specific room
- `offer`: Send WebRTC offer
- `answer`: Send WebRTC answer
- `ice-candidate`: Exchange ICE candidates
- `chat-message`: Send chat messages
- `leave-room`: Leave the current room
- `media-state-change`: Notify others of audio/video toggle

### API Endpoints
- `POST /api/room`: Create a new room
- `GET /api/room/:roomId`: Get room details

## 🐛 Troubleshooting

### "Only pro users can create rooms"
- The system checks for a user with "pro" plan in the database
- For testing, the controller allows room creation if the user doesn't exist
- To create a pro user, add to MongoDB:
```javascript
{
  email: "your@email.com",
  plan: "pro"
}
```

### Camera/Microphone Not Working
- Make sure to allow browser permissions
- Check if other apps are using the camera/mic
- Try a different browser (Chrome/Firefox recommended)

### Can't Connect to Other Users
- Ensure both backend and frontend are running
- Check that Socket.IO connection is established (check browser console)
- Verify firewall/network settings
- For production, you'll need TURN servers for NAT traversal

### Connection Issues
- Clear browser cache and cookies
- Restart both backend and frontend servers
- Check MongoDB connection
- Verify `.env` files are properly configured

## 📝 Notes

- The app currently supports peer-to-peer connections (2 users)
- For multiple users, you'd need to implement mesh or SFU architecture
- HTTPS is required for WebRTC in production
- Consider implementing authentication for production use

## 🔐 Security Considerations

For production deployment:
1. Implement proper authentication (JWT, OAuth)
2. Use HTTPS for all connections
3. Implement rate limiting
4. Add room passwords/access control
5. Use environment-specific STUN/TURN servers
6. Sanitize all user inputs
7. Implement proper error handling

## 🎨 Features

- ✅ Real-time video calling
- ✅ Audio/Video toggle controls
- ✅ Text chat
- ✅ Room sharing via ID
- ✅ Beautiful gradient UI
- ✅ Responsive design
- ✅ Connection status indicators

## 📦 Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO
- **Database**: MongoDB
- **WebRTC**: Native browser APIs
- **Icons**: Lucide React

## 🚀 Deployment

For production deployment:
1. Set up HTTPS
2. Configure TURN servers
3. Update CORS settings
4. Set production environment variables
5. Deploy backend to a Node.js hosting service
6. Deploy frontend to Vercel/Netlify
7. Use production MongoDB instance

---

Made with ❤️ for collaborative learning
