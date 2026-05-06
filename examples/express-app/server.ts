import express from "express";
import Redis from "ioredis";
import { rateLimit } from "../../dist"; // Import from the compiled build

const app = express();

// Initialize Redis 
// (Make sure Redis is actually running on localhost:6379, or provide a custom URI)
const redis = new Redis();

redis.on("error", (err) => console.error("Redis Error", err));

// --- Global Rate Limiter ---
// Limit all users to 5 requests per 10 seconds based on their IP address
const globalLimiter = rateLimit({
  redis,
  feature: "global-api",
  limit: 5,
  window: 10000, 
  failOpen: true, // Allow traffic if Redis goes down
  headers: true,  // Attach remaining/reset headers
});

app.use(globalLimiter);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome! This endpoint shares the global limit.",
    ip: req.ip
  });
});

// --- Specific Route Limiter ---
// A stricter limit: only 2 requests every 20 seconds, based on a custom identifier
const strictLimiter = rateLimit({
  redis,
  feature: "strict-endpoint",
  limit: 2,
  window: 20000,
  identifier: (req: any) => req.headers["x-user-id"] || req.ip,
});

app.get("/strict", strictLimiter, (req, res) => {
  res.json({
    message: "Strict endpoint reached! Check your RateLimit headers.",
    identifier_used: req.headers["x-user-id"] || req.ip
  });
});

app.listen(3000, () => {
  console.log("🚀 Example App listening on port 3000");
  console.log("-> Test global limit: http://localhost:3000/");
  console.log("-> Test strict limit: http://localhost:3000/strict");
});