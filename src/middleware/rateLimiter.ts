import { Request, Response, NextFunction } from "express"
import { SlidingWindowExecutor } from "../redis/slidingWindowExecutor"
import { RateLimiter } from "../core/limiter"
import { RateLimiterConfig } from "../types/config"

export function rateLimit(config: RateLimiterConfig) {

  const executor = new SlidingWindowExecutor(config.redis)
  const limiter = new RateLimiter(executor)

  let scriptLoaded = false;
  
  const attemptLoad = async () => {
    try {
      await executor.loadScript();
      scriptLoaded = true;
    } catch (err) {
      scriptLoaded = false;
      throw err;
    }
  };

  // Attempt to load the script asynchronously on startup.
  // Catch the error to prevent an unhandled promise rejection if Redis is initially down.
  let loadPromise = attemptLoad().catch((err: any) => {
    console.error("[usage-guard] Initial Lua script load failed:", err.message);
  });

  const window = config.window
  const limit = config.limit
  const feature = config.feature
  const failOpen = config.failOpen ?? false
  const sendHeaders = config.headers !== false

  const identifierFn =
    config.identifier || ((req: Request) => req.ip || "unknown")

  return async function (req: Request, res: Response, next: NextFunction) {

    try {
      // If the script wasn't loaded (e.g. from a past failure), retry now
      if (!scriptLoaded) {
        loadPromise = attemptLoad();
        await loadPromise;
      }

      const identifier = identifierFn(req)

      const result = await limiter.check(
        identifier,
        feature,
        window,
        limit
      )

      if (sendHeaders) {
        res.setHeader("X-RateLimit-Limit", limit)
        res.setHeader("X-RateLimit-Remaining", Math.max(0, limit - result.count))
        
        if (result.resetTime > 0) {
          res.setHeader("X-RateLimit-Reset", Math.ceil(result.resetTime / 1000))
        } else {
          res.setHeader("X-RateLimit-Reset", Math.ceil((Date.now() + window) / 1000))
        }
      }

      if (!result.allowed) {
        return res.status(429).json({
          error: "Rate limit exceeded",
          resetTime: result.resetTime
        })
      }

      next()

    } catch (error) {
      if (failOpen) {
        next()
      } else {
        next(error)
      }
    }

  }
}