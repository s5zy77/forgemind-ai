import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { prisma } from './services/db';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

// Production Security Configuration
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Apply rate limiting (Max 150 requests per 10 minutes on API routes)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 150,
  message: { error: 'Too many requests from this IP. Please try again after 10 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// API Routes
app.use('/api', apiRoutes);

// Socket.IO real-time telemetry broadcaster
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to Digital Twin stream: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Broadcast live telemetry updates every 3.5 seconds to connected Digital Twin clients
setInterval(async () => {
  try {
    const assets = await prisma.asset.findMany({ take: 8 });
    const updatedAssets = assets.map((a) => {
      const tempDelta = (Math.random() * 1.2 - 0.6);
      const vibDelta = (Math.random() * 0.2 - 0.1);

      return {
        ...a,
        temperature: Number((a.temperature + tempDelta).toFixed(1)),
        vibration: Number(Math.max(0.1, a.vibration + vibDelta).toFixed(2)),
      };
    });

    io.emit('telemetry_update', updatedAssets);
  } catch (err) {
    // Ignore transient DB sync errors during broadcast
  }
}, 3500);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 ForgeMind AI Server listening on http://localhost:${PORT}`);
});
