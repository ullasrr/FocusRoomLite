import { config } from 'dotenv';
config();
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors'
import express from 'express';
import { Server } from 'socket.io';
import connectToDB from './config/db.js';
import http from 'http';

import dataRoutes from './routes/leftSidebarRoutes.js';
import calendarRoutes from './routes/CalendarRoutes.js'
import notesRoutes from './routes/notesRoutes.js'
import themesRoutes from './routes/themesRoutes.js'
import studygptRoutes from './routes/StudyGPTRoutes.js';
import roomRoutes from './routes/RoomRoutes.js';
import setupSocket from './socket/index.js';


const app = express();
const PORT = process.env.PORT;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use('/', dataRoutes);
app.use('/api/notes', notesRoutes);
app.use('/themes', express.static(path.join(__dirname, 'public/themes')));
app.use('/api/themes', themesRoutes);
app.use('/api', calendarRoutes);
app.use('/api', studygptRoutes);
app.use('/api/room', roomRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

setupSocket(io);



connectToDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed:', err);
  });