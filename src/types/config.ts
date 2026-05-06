import Redis from "ioredis";
import { Request } from "express";

export interface RateLimiterConfig {
    redis: Redis;
    window: number;
    limit: number;
    feature: string;
    identifier?: (req: Request & Record<string, any>) => string;
    failOpen?: boolean;
    headers?: boolean;
}