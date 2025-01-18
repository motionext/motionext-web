import { Redis } from '@upstash/redis'

interface RateLimitState {
  count: number;
  timestamp: number;
  remaining: number;
}

const WINDOW_SIZE_MS = 300000; // 5 minutes
const MAX_REQUESTS = 15; // 15 attempts in 5 minutes

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
}> {
  const now = Date.now();
  let state: RateLimitState | null = null;

  try {
    const stateData = await redis.get<RateLimitState>(`ratelimit:${identifier}`);
    
    if (stateData && now - stateData.timestamp <= WINDOW_SIZE_MS) {
      state = stateData;
    }

    if (!state || now - state.timestamp > WINDOW_SIZE_MS) {
      state = {
        count: 1,
        timestamp: now,
        remaining: MAX_REQUESTS - 1,
      };
    } else if (state.count < MAX_REQUESTS) {
      state.count++;
      state.remaining = MAX_REQUESTS - state.count;
    } else {
      return {
        success: false,
        remaining: 0,
        reset: Math.ceil((state.timestamp + WINDOW_SIZE_MS - now) / 1000),
      };
    }

    await redis.set(
      `ratelimit:${identifier}`,
      state,
      { ex: Math.ceil(WINDOW_SIZE_MS / 1000) }
    );

    return {
      success: state.remaining > 0,
      remaining: Math.max(0, state.remaining),
      reset: Math.ceil((state.timestamp + WINDOW_SIZE_MS - now) / 1000),
    };
  } catch (error) {
    console.error("Error accessing Redis:", error);
    return {
      success: true,
      remaining: MAX_REQUESTS - 1,
      reset: Math.ceil(WINDOW_SIZE_MS / 1000),
    };
  }
}
