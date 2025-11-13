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
import reportsRoutes from './routes/reportsRoutes';

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
      dashboard: '/api/dashboard',
      reports: '/api/reports'
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
app.use('/api/reports', reportsRoutes);

// Seed database on startup (only in development)
if (process.env.NODE_ENV !== 'production') {
  // Esperar un poco para asegurar que la conexión esté lista
  setTimeout(() => {
    seedDatabase()
      .then(() => {
        console.log('✅ Base de datos inicializada');
      })
      .catch((error) => {
        console.error('❌ Error inicializando base de datos:', error);
        console.error('💡 Asegúrate de que:');
        console.error('   1. PostgreSQL esté corriendo');
        console.error('   2. La base de datos exista');
        console.error('   3. DBCONNECTION en .env sea correcta');
        console.error('   4. Ejecuta: npm run db:push (para crear las tablas)');
      });
  }, 1000);
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 TaskSystemCore EIRL Backend`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}`);
});

export default app;

