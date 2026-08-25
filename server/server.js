import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import studentRoutes from './routes/studentRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import { initDb } from './storage/db.js';

// Load environment variables from .env if present
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database on Startup
initDb(false);

// Root & Health Check Endpoints (compatible with Render, Railway, AWS ALB health probes)
app.get(['/', '/health', '/api/health'], (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// API Routes (supports both /api/path and /path in serverless environments)
app.use('/api/students', studentRoutes);
app.use('/students', studentRoutes);

app.use('/api/projects', projectRoutes);
app.use('/projects', projectRoutes);

app.use('/api/projects', matchRoutes); // Handles /api/projects/:id/matches
app.use('/projects', matchRoutes);

app.use('/api/seed', seedRoutes);
app.use('/seed', seedRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `API route ${req.originalUrl} does not exist.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

// Start Server if run directly (bypassed in Vercel serverless functions)
if (process.env.NODE_ENV !== 'test' && !process.argv[1]?.includes('testMatching') && !process.env.VERCEL) {
  app.listen(PORT, HOST, () => {
    console.log(`🚀 ProjectMatch Backend running at http://localhost:${PORT}`);
    console.log(`📡 Health check available at http://localhost:${PORT}/api/health`);
    console.log(`🤖 Gemini AI Mode: ${process.env.GEMINI_API_KEY ? 'Active (Gemini Flash)' : 'Offline / Resilient Fallback'}`);
  });
}

export default app;
