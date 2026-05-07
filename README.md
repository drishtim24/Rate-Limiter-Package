# 🚀 Atomic-Rate-Limiter

A high-performance, atomic rate-limiting library using the **Sliding Window Log** algorithm powered by Redis Lua scripts. Designed natively for Node.js, `atomic-rate-limiter` guarantees exact API rate enforcement with zero race conditions, and natively ships with a flexible Express middleware.

---

## 🎓 Academic Project Information

### 📄 Project Report of Industry Oriented Hands-On Experience (IOHE)

**Project Title:** Atomic-Rate-Limiter

Submitted in partial fulfillment of the requirements for the award of degree of:

### 🎓 Bachelor of Engineering  
Computer Science and Engineering  
Chitkara University , Rajpura

---

## 👨‍💻 Submitted By

- **Drishti Middha** — 2210991549  
- **Mannat** — 2210990556   

---

## 👩‍🏫 Supervised By

- **Dr. Lalit Sharma**   
- Chitkara University, Rajpura  

---

## 📊 Project Status

✅ Completed  

---

## 📌 Project Type

- Industry Oriented Hands-On Experience (IOHE)  
- High-Performance Rate Limiting Library  

---

## 🌟 Features

* 🔐 **Atomic Operations**  
  - Uses Redis `EVALSHA` ensuring 100% thread safety across highly-concurrent distributed limits  

* 💬 **Fail-Open Support**  
  - Never let a Redis crash take down your API. You can safely configure the middleware to fail-open  

* 📝 **Auto Headers**  
  - HTTP headers natively injected into responses for HTTP/1.1 API limit specifications  

* 👥 **Fully Typed**  
  - Written in Strict TypeScript with full dual-compilation definitions for ESM (`import`) and CJS (`require`)  

---

## 🛠️ Tech Stack

### Core Technologies

* Node.js  
* Express.js  
* Redis  
* TypeScript  

### Libraries

* ioredis  
* nanoid  

---

## 📂 Project Structure

```
atomic-rate-limiter/
│
├── src/
│   ├── index.ts
│   ├── core/
│   │   └── limiter.ts
│   ├── middleware/
│   │   └── rateLimiter.ts
│   ├── redis/
│   │   └── slidingWindowExecutor.ts
│   ├── scripts/
│   │   └── slidingWindow.lua
│   ├── types/
│   │   └── config.ts
│   └── utils/
│
├── examples/
│   ├── express-app/
│   │   ├── server.ts
│   │   └── docker-compose.yml
│   └── demo-app/
│       ├── src/
│       ├── server.ts
│       └── package.json
│
├── dist/
│   ├── index.js
│   ├── index.mjs
│   └── scripts/
│       └── slidingWindow.lua
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/drishtim24/Rate-Limiter-Package.git
cd drishti-rate-limiter
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Docker Setup

This project requires Redis for rate limiting. You need to have Docker Setup Desktop App in running state to run this project for Redis.

#### Start Redis with Docker Compose

```bash
cd examples/express-app
docker compose up -d
```

This will start a Redis container in the background.

---

## 🔑 Environment Variables

### For Examples

```env
REDIS_URL=redis://127.0.0.1:6379
PORT=3000
```

---

## ▶️ Running the Project

### Build the Library

```bash
npm run build
```

### Run Example Server

```bash
npm run example
```

### Run Demo App

```bash
cd examples/demo-app
npm install
npm run server
```

---

## Motivation
Most basic rate limiters use "fixed window" counting, which causes spike boundary issues (e.g. 100 requests at 12:00:59, and 100 requests at 12:01:01). By leveraging Redis sorted sets (ZSETS) under the hood with atomic Lua transactions, `atomic-rate-limiter` dynamically slides the window millisecond-by-millisecond for completely rigorous limit enforcement.

## Features
- **Atomic Operations:** Uses Redis `EVALSHA` ensuring 100% thread safety across highly-concurrent distributed limits.
- **Fail-Open Support:** Never let a Redis crash take down your API. You can safely configure the middleware to fail-open.
- **Auto Headers:** HTTP headers natively injected into responses for HTTP/1.1 API limit specifications.
- **Fully Typed:** Written in Strict TypeScript with full dual-compilation definitions for ESM (`import`) and CJS (`require`).

## Installation

```bash
npm install atomic-rate-limiter ioredis
```

## Usage

```typescript
import express from "express";
import Redis from "ioredis";
import { rateLimit } from "atomic-rate-limiter";

const app = express();
const redis = new Redis("redis://127.0.0.1:6379"); // Initialize your Redis Client

const globalLimiter = rateLimit({
  redis,
  feature: "global-api",     // Namespace your limits in redis
  limit: 100,                // 100 requests allowed
  window: 60000,             // per 60,000 milliseconds (1 minute)
  failOpen: true,            // if Redis dies, let users through transparently
  headers: true,             // attach X-RateLimit-* headers to Express res
});

app.use(globalLimiter);

// For stricter endpoints, you can supply custom identifiers (like user id):
const premiumLimiter = rateLimit({
  redis,
  feature: "premium-endpoint",
  limit: 10,
  window: 1000,
  identifier: (req) => req.headers["x-user-id"] || req.ip
});

app.post("/premium", premiumLimiter, (req, res) => {
  res.json({ success: true });
});
```

## Configuration Interface (`RateLimiterConfig`)

| Property | Type | Default | Description |
|---|---|---|---|
| `redis` | `Redis` | **Required** | ioredis instance object |
| `window` | `number` | **Required** | Time window (in milliseconds) |
| `limit` | `number` | **Required** | Max allowed requests per window |
| `feature` | `string` | **Required** | Identifying string to uniquely isolate these limits in the Redis store |
| `identifier` | `Function` | `req.ip` | Extracts the user identifier. Receives `(req)` |
| `failOpen` | `boolean` | `false` | Should the limiter allow requests through if Redis server goes offline? |
| `headers` | `boolean` | `true` | Send standard `X-RateLimit-Limit`, `Remaining`, and `Reset` API headers |

## License
MIT
