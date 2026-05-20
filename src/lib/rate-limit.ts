import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function createRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

const redis = createRedis()

// 5 attempts per IP per 10 minutes for login
export const loginRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      analytics: false,
    })
  : null

// 3 attempts per IP per 15 minutes for forgot-password
export const forgotPasswordRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '15 m'),
      analytics: false,
    })
  : null
