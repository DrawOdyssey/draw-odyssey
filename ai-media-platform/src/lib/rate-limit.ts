// Simple in-memory rate limiter for API routes
// In production, use Redis (Upstash) for distributed rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitStore.entries()).forEach(([key, entry]) => {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  });
}, 5 * 60 * 1000);
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  "generate": { maxRequests: 10, windowMs: 60 * 1000 },      // 10 per minute
  "api": { maxRequests: 30, windowMs: 60 * 1000 },            // 30 per minute
  "auth": { maxRequests: 5, windowMs: 60 * 1000 },            // 5 per minute
  "webhook": { maxRequests: 100, windowMs: 60 * 1000 },       // 100 per minute
  "default": { maxRequests: 60, windowMs: 60 * 1000 },        // 60 per minute
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
}

export function checkRateLimit(
  identifier: string,
  type: keyof typeof RATE_LIMITS = "default"
): RateLimitResult {
  const config = RATE_LIMITS[type] || RATE_LIMITS.default;
  const key = `${type}:${identifier}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  };
}

// Helper to get user identifier from request
export function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const authHeader = request.headers.get("authorization");
  // Prefer user ID from auth, fall back to IP
  return authHeader ? `user:${authHeader.slice(-12)}` : `ip:${ip}`;
}
