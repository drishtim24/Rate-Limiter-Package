import Redis from "ioredis"
import fs from "fs"
import path from "path"

export class SlidingWindowExecutor {
  private redis: Redis
  private scriptSha: string | null = null

  constructor(redis: Redis) {
    this.redis = redis
  }

  async loadScript() {
    const scriptPath = path.join(__dirname, "scripts", "slidingWindow.lua")
    const script = fs.readFileSync(scriptPath, "utf8")

    this.scriptSha = await this.redis.script("LOAD", script) as string
  }

  async execute(
    key: string,
    window: number,
    limit: number,
    currentTime: number,
    member: string
  ): Promise<number[]> {

    if (!this.scriptSha) {
      throw new Error("Lua script not loaded")
    }

    const result = await this.redis.evalsha(
      this.scriptSha,
      1,
      key,
      window,
      limit,
      currentTime,
      member
    )

    return result as number[]
  }
}