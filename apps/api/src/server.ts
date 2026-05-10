// apps/api/src/server.ts
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import routes
import itemsRouter from './routes/items.routes.ts'

// Initialize Express app
const app: express.Express = express();
const PORT = process.env.API_PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ====================
// MIDDLEWARE
// ====================

// Security middleware
app.use(helmet());
app.use(cors());

// Logging middleware (hanya di development)
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====================
// ROUTES
// ====================

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'API Service',
    environment: NODE_ENV
  });
});

// API routes dengan versioning
app.use('/api/v1/items', itemsRouter);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Express.js API',
    documentation: '/api-docs',
    health: '/health',
    version: '1.0.0'
  });
});

// ====================
// ERROR HANDLING
// ====================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// ====================
// SERVER START
// ====================

app.listen(PORT, () => {
  console.log(`
  🚀 Server is running!
  📍 Port: ${PORT}
  🌍 Environment: ${NODE_ENV}
  📅 Time: ${new Date().toISOString()}
  🔗 Local: http://localhost:${PORT}
  🔗 Health: http://localhost:${PORT}/health
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

export default app;
