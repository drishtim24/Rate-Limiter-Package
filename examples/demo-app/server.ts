import express from 'express';
import cors from 'cors';
import { rateLimit } from '../../dist'; // Import from the compiled build
import Redis from 'ioredis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Fix __dirname for ES modules if needed, or if we use ts-node/tsx it might be CJS or ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Setup Redis Client
const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});
redis.on('connect', () => {
  console.log('Connected to Redis');
});

// Middleware
app.use(cors());
app.use(express.json());

// Global Limiter - 20 requests per minute
const globalLimiter = rateLimit({
  redis,
  feature: 'global-api',
  limit: 20,
  window: 60000,
  failOpen: true,
  headers: true,
});

// Apply global limiter
app.use('/api', globalLimiter);

// Specific Endpoint Limiters

// Standard: 5 requests per 10 seconds
const standardLimiter = rateLimit({
  redis,
  feature: 'standard-api',
  limit: 5,
  window: 10000,
  failOpen: true,
  headers: true,
});

// Premium: 10 requests per 5 seconds
const premiumLimiter = rateLimit({
  redis,
  feature: 'premium-api',
  limit: 10,
  window: 5000,
  failOpen: true,
  headers: true,
});

// Routes
app.get('/api/standard', standardLimiter, (req, res) => {
  res.json({ success: true, message: 'Standard API request successful!' });
});

app.get('/api/premium', premiumLimiter, (req, res) => {
  res.json({ success: true, message: 'Premium API request successful!' });
});

// Serve frontend in production (optional, we'll mostly run Vite dev server in parallel)
app.use(express.static(path.join(__dirname, 'dist')));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
