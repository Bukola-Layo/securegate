import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function createRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) return null
  if (url.includes('your-upstash-url') || token.includes('your_upstash_token')) return null

  return new Redis({ url, token })
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
