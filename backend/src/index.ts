import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { seedDatabase } from './db/seed';

// Routes
import authRoutes from './routes/authRoutes';
import ticketRoutes from './routes/ticketRoutes';
import clientRoutes from './routes/clientRoutes';
import agentRoutes from './routes/agentRoutes';
import commentRoutes from './routes/commentRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'TaskSystemCore EIRL API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      tickets: '/api/tickets',
      clients: '/api/clients',
      agents: '/api/agents',
      comments: '/api/comments',
      dashboard: '/api/dashboard'
    }
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Seed database on startup (only in development)
if (process.env.NODE_ENV !== 'production') {
  seedDatabase()
    .then(() => {
      console.log('✅ Base de datos inicializada');
    })
    .catch((error) => {
      console.error('❌ Error inicializando base de datos:', error);
    });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 TaskSystemCore EIRL Backend`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}`);
});

export default app;

