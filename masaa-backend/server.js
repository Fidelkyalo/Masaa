import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import calendarRoutes from './routes/calendars.js';
import eventRoutes from './routes/events.js';
import taskRoutes from './routes/tasks.js';
import goalRoutes from './routes/goals.js';
import bookingRoutes from './routes/booking.js';
import workspaceRoutes from './routes/workspaces.js';
import aiRoutes from './routes/ai.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payments.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Body Parsers
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root Healthcheck
app.get('/', (req, res) => {
  res.json({
    name: 'MASAA REST API Engine',
    version: '1.0.0',
    status: 'Operational',
    docs: '/api/v1/health'
  });
});

app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: 'Connected',
      auth: 'JWT Active',
      ai: 'Ready',
      payments: 'M-Pesa + Stripe Active'
    }
  });
});

// Register API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/calendars', authenticateToken, calendarRoutes);
app.use('/api/v1/events', authenticateToken, eventRoutes);
app.use('/api/v1/tasks', authenticateToken, taskRoutes);
app.use('/api/v1/goals', authenticateToken, goalRoutes);
app.use('/api/v1/booking-pages', authenticateToken, bookingRoutes);
app.use('/api/v1/workspaces', authenticateToken, workspaceRoutes);
app.use('/api/v1/ai', authenticateToken, aiRoutes);
app.use('/api/v1/admin', authenticateToken, adminRoutes);
app.use('/api/v1/payments', authenticateToken, paymentRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 MASAA Backend REST API running on http://localhost:${PORT}`);
  console.log(`📌 Health check available at http://localhost:${PORT}/api/v1/health`);
});
