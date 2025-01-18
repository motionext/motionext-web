import { put, del, list } from '@vercel/blob'

interface RateLimitState {
  count: number
  timestamp: number
  remaining: number
}

const WINDOW_SIZE_MS = 300000 // 5 minutos
const MAX_REQUESTS = 15 // 15 tentativas por 5 minutos

// Cache em memória para desenvolvimento
const inMemoryStore = new Map<string, RateLimitState>()

export async function checkRateLimit(identifier: string): Promise<{
  success: boolean
  remaining: number
  reset: number
}> {
  const now = Date.now()
  let state: RateLimitState | null = null

  // Em produção, usa Vercel Blob
  if (process.env.VERCEL_ENV === 'production') {
    try {
      const { blobs } = await list()
      const rateLimit = blobs.find(blob => blob.pathname === `ratelimit-${identifier}`)
      
      if (rateLimit) {
        const response = await fetch(rateLimit.url)
        const stateData = await response.json()
        state = stateData as RateLimitState
        
        // Verifica se o estado expirou
        if (now - state.timestamp > WINDOW_SIZE_MS) {
          await del(rateLimit.url)
          state = null
        }
      }
    } catch (error) {
      console.error('Erro ao acessar Vercel Blob:', error)
      state = null
    }
  } else {
    // Em desenvolvimento, usa Map em memória
    state = inMemoryStore.get(identifier) || null
  }

  // Se não existe estado ou expirou, cria novo
  if (!state) {
    state = { 
      count: 1, 
      timestamp: now,
      remaining: MAX_REQUESTS - 1
    }
    
    if (process.env.VERCEL_ENV === 'production') {
      try {
        await put(`ratelimit-${identifier}`, JSON.stringify(state), {
          access: 'public',
          addRandomSuffix: false,
        })
      } catch (error) {
        console.error('Erro ao salvar no Vercel Blob:', error)
      }
    } else {
      inMemoryStore.set(identifier, state)
    }

    return {
      success: true,
      remaining: state.remaining,
      reset: now + WINDOW_SIZE_MS
    }
  }

  // Verifica se excedeu o limite
  if (state.remaining <= 0) {
    const timeLeft = state.timestamp + WINDOW_SIZE_MS - now
    return {
      success: false,
      remaining: 0,
      reset: Math.ceil(timeLeft / 1000)
    }
  }

  // Atualiza o estado
  state.count++
  state.remaining = Math.max(0, MAX_REQUESTS - state.count)
  
  if (process.env.VERCEL_ENV === 'production') {
    try {
      await put(`ratelimit-${identifier}`, JSON.stringify(state), {
        access: 'public',
        addRandomSuffix: false,
      })
    } catch (error) {
      console.error('Erro ao atualizar no Vercel Blob:', error)
    }
  } else {
    inMemoryStore.set(identifier, state)
  }

  return {
    success: true,
    remaining: state.remaining,
    reset: Math.ceil((state.timestamp + WINDOW_SIZE_MS - now) / 1000)
  }
} 