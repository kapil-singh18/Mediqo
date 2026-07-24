import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './config/db.js';
import { AuthService } from './services/authService.js';
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import billRoutes from './routes/billRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import receptionistRoutes from './routes/receptionistRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  // Basic Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  // Database connection & Seed initial default accounts
  await connectDB();
  await AuthService.seedUsers();

  // Healthcheck endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Mediqo API', version: '1.0.0' });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/appointments', appointmentRoutes);
  app.use('/api/prescriptions', prescriptionRoutes);
  app.use('/api/bills', billRoutes);
  app.use('/api/doctor', doctorRoutes);
  app.use('/api/receptionist', receptionistRoutes);

  // Global Error Handler for API
  app.use(errorHandler);

  // Vite Development / Production Middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const clientDir = path.resolve(process.cwd(), 'client');
    const vite = await createViteServer({
      root: clientDir,
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'client', 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(` Mediqo Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Mediqo server:', err);
  process.exit(1);
});
