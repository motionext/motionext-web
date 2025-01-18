import { put, del, list } from "@vercel/blob";

interface RateLimitState {
  count: number;
  timestamp: number;
  remaining: number;
}

const WINDOW_SIZE_MS = 300000; // 5 minutes
const MAX_REQUESTS = 15; // 15 attempts in 5 minutes

const inMemoryStore = new Map<string, RateLimitState>();

export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
}> {
  const now = Date.now();
  let state: RateLimitState | null = null;

  if (process.env.VERCEL_ENV === "production") {
    try {
      const { blobs } = await list();
      const rateLimit = blobs.find(blob => blob.pathname === `ratelimit-${identifier}`);

      if (rateLimit) {
        const response = await fetch(rateLimit.url);
        const stateData = await response.json();
        state = stateData as RateLimitState;

        if (now - state.timestamp > WINDOW_SIZE_MS) {
          await del(rateLimit.url);
          state = null;
        }
      }
    } catch (error) {
      console.error("Error accessing Vercel Blob:", error);
      state = null;
    }
  } else {
    state = inMemoryStore.get(identifier) || null;
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

  if (process.env.VERCEL_ENV === "production") {
    try {
      await put(`ratelimit-${identifier}`, JSON.stringify(state), {
        access: "public",
        addRandomSuffix: false,
      });
    } catch (error) {
      console.error("Error saving to Vercel Blob:", error);
    }
  } else {
    inMemoryStore.set(identifier, state);
  }

  return {
    success: state.remaining > 0,
    remaining: Math.max(0, state.remaining),
    reset: Math.ceil((state.timestamp + WINDOW_SIZE_MS - now) / 1000),
  };
}
