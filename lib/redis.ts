import Redis from "ioredis";

let redisClient: Redis | null = null;

// In-memory fallback stores for when Redis is unavailable or unconfigured (development/fallback)
const memoryRateLimits = new Map<string, { count: number; expiresAt: number }>();
const memoryFailedLogins = new Map<string, { count: number; lockedUntil: number }>();

export function getRedis(): Redis | null {
  const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
  if (!redisUrl) {
    return null;
  }

  // Handle redis:// or rediss:// connection strings with ioredis
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

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean; remaining: number }> {
  const redis = getRedis();

  if (!redis) {
    // In-memory fallback rate limiting
    const now = Date.now();
    const existing = memoryRateLimits.get(key);

    if (!existing || existing.expiresAt < now) {
      memoryRateLimits.set(key, { count: 1, expiresAt: now + windowSeconds * 1000 });
      return { success: true, remaining: limit - 1 };
    }

    existing.count += 1;
    const remaining = Math.max(0, limit - existing.count);
    return {
      success: existing.count <= limit,
      remaining,
    };
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

/**
 * Brute-force & Credential Stuffing Prevention
 * Tracks failed login attempts per IP / identifier.
 * Lockout threshold: 5 failed attempts = 15 minute (900s) lock.
 */
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_SECONDS = 900; // 15 minutes

export async function isLoginLocked(identifier: string): Promise<boolean> {
  const redis = getRedis();
  const key = `lock:admin:auth:${identifier}`;

  if (!redis) {
    const record = memoryFailedLogins.get(identifier);
    if (!record) return false;
    if (Date.now() > record.lockedUntil) {
      memoryFailedLogins.delete(identifier);
      return false;
    }
    return record.count >= MAX_FAILED_ATTEMPTS;
  }

  try {
    if (redis.status === "wait") await redis.connect();
    const count = await redis.get(key);
    return count !== null && parseInt(count, 10) >= MAX_FAILED_ATTEMPTS;
  } catch (e) {
    console.warn("[Redis Lock Check]", e);
    return false;
  }
}

export async function recordFailedLogin(identifier: string): Promise<number> {
  const redis = getRedis();
  const key = `lock:admin:auth:${identifier}`;

  if (!redis) {
    const now = Date.now();
    const record = memoryFailedLogins.get(identifier) || {
      count: 0,
      lockedUntil: now + LOCKOUT_WINDOW_SECONDS * 1000,
    };
    record.count += 1;
    record.lockedUntil = now + LOCKOUT_WINDOW_SECONDS * 1000;
    memoryFailedLogins.set(identifier, record);
    return record.count;
  }

  try {
    if (redis.status === "wait") await redis.connect();
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, LOCKOUT_WINDOW_SECONDS);
    }
    return current;
  } catch (e) {
    console.warn("[Redis Record Failed Login]", e);
    return 1;
  }
}

export async function resetFailedLogins(identifier: string): Promise<void> {
  const redis = getRedis();
  const key = `lock:admin:auth:${identifier}`;

  if (!redis) {
    memoryFailedLogins.delete(identifier);
    return;
  }

  try {
    if (redis.status === "wait") await redis.connect();
    await redis.del(key);
  } catch (e) {
    console.warn("[Redis Reset Failed Logins]", e);
  }
}
