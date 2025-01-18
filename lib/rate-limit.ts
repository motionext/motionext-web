// import { Redis } from '@upstash/redis';

// interface RateLimitState {
//   count: number;
//   timestamp: number;
//   remaining: number;
// }

// interface CacheEntry {
//   state: RateLimitState;
//   expiresAt: number;
//   needsSync: boolean;
// }

// const WINDOW_SIZE_MS = 300000; // 5 minutes
// const MAX_REQUESTS = 15; // 15 attempts in 5 minutes
// const CACHE_TTL = 10000; // 10 seconds cache TTL
// const BATCH_WRITE_INTERVAL = 2000; // Update Redis every 30 seconds

// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL!,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN!,
// });

// // In-memory cache for pending state updates
// const stateCache = new Map<string, CacheEntry>();

// // Batch of pending writes
// const pendingWrites = new Set<string>();

// function calculateReset(timestamp: number, now: number): number {
//   return Math.ceil((timestamp + WINDOW_SIZE_MS - now) / 1000);
// }

// function createNewState(now: number): RateLimitState {
//   return {
//     count: 1,
//     timestamp: now,
//     remaining: MAX_REQUESTS - 1,
//   };
// }

// async function updateRedisState(identifier: string, state: RateLimitState): Promise<void> {
//   await redis.set(
//     `ratelimit:${identifier}`,
//     state,
//     { ex: Math.ceil(WINDOW_SIZE_MS / 1000) }
//   );
// }

// export async function checkRateLimit(identifier: string): Promise<{
//   success: boolean;
//   remaining: number;
//   reset: number;
// }> {
//   const now = Date.now();
  
//   // Check cache first
//   const cached = stateCache.get(identifier);
//   if (cached && now < cached.expiresAt) {
//     const { state } = cached;
    
//     if (state.remaining > 0) {
//       state.count++;
//       state.remaining--;
//       cached.needsSync = true;
//       pendingWrites.add(identifier);
      
//       return {
//         success: true,
//         remaining: state.remaining,
//         reset: calculateReset(state.timestamp, now),
//       };
//     }
    
//     return {
//       success: false,
//       remaining: 0,
//       reset: calculateReset(state.timestamp, now),
//     };
//   }

//   try {
//     const stateData = await redis.get<RateLimitState>(`ratelimit:${identifier}`);
//     const state = (stateData && now - stateData.timestamp <= WINDOW_SIZE_MS) 
//       ? stateData 
//       : createNewState(now);

//     const cacheEntry: CacheEntry = {
//       state,
//       expiresAt: now + CACHE_TTL,
//       needsSync: true
//     };

//     stateCache.set(identifier, cacheEntry);
//     pendingWrites.add(identifier);

//     // Force immediate sync when close to limit
//     if (state.remaining <= 2 || state.remaining === 0) {
//       await updateRedisState(identifier, state);
//       pendingWrites.delete(identifier);
//     }

//     return {
//       success: state.remaining > 0,
//       remaining: Math.max(0, state.remaining),
//       reset: calculateReset(state.timestamp, now),
//     };
//   } catch (error) {
//     console.error("Error accessing Redis:", error);
//     return {
//       success: true, 
//       remaining: MAX_REQUESTS - 1,
//       reset: Math.ceil(WINDOW_SIZE_MS / 1000),
//     };
//   }
// }

// async function syncToRedis(): Promise<void> {
//   if (pendingWrites.size === 0) return;

//   const writes = Array.from(pendingWrites);
//   pendingWrites.clear();

//   const pipeline = redis.pipeline();
  
//   writes.forEach(identifier => {
//     const cached = stateCache.get(identifier);
//     if (cached?.needsSync) {
//       pipeline.set(
//         `ratelimit:${identifier}`,
//         cached.state,
//         { ex: Math.ceil(WINDOW_SIZE_MS / 1000) }
//       );
//       cached.needsSync = false;
//     }
//   });

//   try {
//     await pipeline.exec();
//   } catch (error) {
//     console.error("Error syncing to Redis:", error);
//   }
// }

// function cleanupCache(): void {
//   const now = Date.now();
//   stateCache.forEach((value, key) => {
//     if (now >= value.expiresAt) {
//       if (value.needsSync) {
//         pendingWrites.add(key);
//       }
//       stateCache.delete(key);
//     }
//   });
// }

// // Schedule cleanup and sync
// setInterval(cleanupCache, 60000); // Clean cache every minute
// setInterval(syncToRedis, BATCH_WRITE_INTERVAL); // Sync every 30 seconds
