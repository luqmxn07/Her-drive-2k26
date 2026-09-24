import Redis from "ioredis";

let redisClient: Redis | null = null;

export function getRedis(): Redis | null {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return null;
  }

  if (!redisClient) {
    try {
      redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        connectTimeout: 5000,
        lazyConnect: true,
      });

      redisClient.on("error", (err) => {
        console.warn("[Redis] Connection error:", err.message);
      });
    } catch (e) {
      console.warn("[Redis] Failed to initialize Redis client:", e);
      return null;
    }
  }

  return redisClient;
}

export async function checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<{ success: boolean; remaining: number }> {
  const redis = getRedis();
  if (!redis) {
    // If Redis is not yet configured, allow request to proceed gracefully
    return { success: true, remaining: limit };
  }

  try {
    if (redis.status === "wait") {
      await redis.connect();
    }
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }
    return {
      success: current <= limit,
      remaining: Math.max(0, limit - current),
    };
  } catch (error) {
    console.warn("[Redis RateLimit Error]", error);
    return { success: true, remaining: limit };
  }
}
