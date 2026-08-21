import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/db.js';

import authRoutes from './server/routes/authRoutes.js';
import transactionRoutes from './server/routes/transactionRoutes.js';
import reportRoutes from './server/routes/reportRoutes.js';
import supportRoutes from './server/routes/supportRoutes.js';
import adminRoutes from './server/routes/adminRoutes.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize MongoDB connection & seeding
  await connectDB();

  // JSON middleware
  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      app: 'Zen FinTrack',
      database: 'MongoDB',
      tagline: 'Simple tracking. Smarter saving.',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/support', supportRoutes);
  app.use('/api/admin', adminRoutes);

  // Vite middleware for dev or static server in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Zen FinTrack server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
