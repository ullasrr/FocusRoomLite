import { validateRoom } from "../controllers/RoomController.js";

export default function setupSocket(io) {
  io.on('connection', (socket) => {
    socket.data.roomId = null;
    socket.data.userId = null;

    socket.on('joinRoom', async ({ roomId, userId }) => {
      try {
        const roomExists = await validateRoom(roomId);
        if (!roomExists) {
          socket.emit('error', { type: 'ROOM_NOT_FOUND', message: 'Room does not exist' });
          return;
        }

        if (socket.data.roomId) {
          socket.leave(socket.data.roomId);
          socket.to(socket.data.roomId).emit('user-disconnected', socket.data.userId);
        }

        socket.data.roomId = roomId;
        socket.data.userId = userId;
        socket.join(roomId);

        const roomInfo = await io.in(roomId).fetchSockets();
        const connectedUsers = roomInfo
          .map(s => s.data.userId)
          .filter(id => id !== null && id !== userId);

        socket.to(roomId).emit('user-connected', { userId, connectedUsers });
        socket.emit('room-joined', { roomId, connectedUsers });
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { type: 'JOIN_ERROR', message: 'Failed to join room' });
      }
    });


    socket.on('offer', (data) => {
      const { roomId, offer, targetUserId } = data;

      if (!socket.data.roomId || socket.data.roomId !== roomId) {
        socket.emit('error', { type: 'UNAUTHORIZED', message: 'Not authorized' });
        return;
      }

      const offerData = {
        offer,
        from: socket.data.userId,
        fromSocketId: socket.id
      };

      socket.to(roomId).emit('offer', offerData);
    });

    socket.on('answer', (data) => {
      const { roomId, answer } = data;

      if (!socket.data.roomId || socket.data.roomId !== roomId) {
        socket.emit('error', { type: 'UNAUTHORIZED', message: 'Not authorized' });
        return;
      }

      const answerData = {
        answer,
        from: socket.data.userId,
        fromSocketId: socket.id
      };

      socket.to(roomId).emit('answer', answerData);
    });

    socket.on('ice-candidate', (data) => {
      const { roomId, candidate } = data;

      if (!socket.data.roomId || socket.data.roomId !== roomId) {
        return;
      }

      socket.to(roomId).emit('ice-candidate', {
        candidate,
        from: socket.data.userId,
        fromSocketId: socket.id
      });
    });

    socket.on('chat-message', (data) => {
      const { roomId, message, timestamp } = data;

      if (!socket.data.roomId || socket.data.roomId !== roomId) {
        return;
      }

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return;
      }

      const sanitizedMessage = message.trim().substring(0, 500);

      io.to(roomId).emit('chat-message', {
        message: sanitizedMessage,
        from: socket.data.userId,
        fromSocketId: socket.id,
        timestamp: timestamp || new Date().toISOString(),
        roomId
      });
    }); 

    socket.on('leave-room', () => {
      const { roomId, userId } = socket.data;

      if (roomId && userId) {
        socket.leave(roomId);
        socket.to(roomId).emit('user-disconnected', { userId, socketId: socket.id });
        socket.data.roomId = null;
        socket.data.userId = null;
        socket.emit('left-room', { roomId });
      }
    });

    socket.on('typing-start', () => {
      const { roomId, userId } = socket.data;
      if (roomId && userId) {
        socket.to(roomId).emit('user-typing', { userId, isTyping: true });
      }
    });

    socket.on('typing-stop', () => {
      const { roomId, userId } = socket.data;
      if (roomId && userId) {
        socket.to(roomId).emit('user-typing', { userId, isTyping: false });
      }
    });

    socket.on('media-state-change', (data) => {
      const { roomId, mediaState } = data;

      if (!socket.data.roomId || socket.data.roomId !== roomId) {
        return;
      }

      socket.to(roomId).emit('user-media-state-change', {
        userId: socket.data.userId,
        mediaState
      });
    });

    socket.on('disconnect', () => {
      const { roomId, userId } = socket.data;
      if (roomId && userId) {
        socket.to(roomId).emit('user-disconnected', {
          userId,
          socketId: socket.id,
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  io.engine.on('connection_error', (err) => {
    console.error('Connection error:', err);
  });
};
