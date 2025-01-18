import { put, del, list } from '@vercel/blob'

interface RateLimitState {
  count: number
  timestamp: number
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
        state = await response.json()
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
  if (!state || now - state.timestamp > WINDOW_SIZE_MS) {
    state = { count: 1, timestamp: now }
    
    if (process.env.VERCEL_ENV === 'production') {
      try {
        const blob = await put(`ratelimit-${identifier}`, JSON.stringify(state), {
          access: 'public',
          addRandomSuffix: false,
        })

        // Agendar deleção após expiração
        setTimeout(async () => {
          try {
            await del(blob.url)
          } catch (error) {
            console.error('Erro ao deletar blob:', error)
          }
        }, WINDOW_SIZE_MS)
      } catch (error) {
        console.error('Erro ao salvar no Vercel Blob:', error)
      }
    } else {
      inMemoryStore.set(identifier, state)

      // Limpar entrada após expiração em desenvolvimento
      setTimeout(() => {
        inMemoryStore.delete(identifier)
      }, WINDOW_SIZE_MS)
    }

    return {
      success: true,
      remaining: MAX_REQUESTS - 1,
      reset: now + WINDOW_SIZE_MS
    }
  }

  // Verifica se excedeu o limite
  if (state.count >= MAX_REQUESTS) {
    const timeLeft = state.timestamp + WINDOW_SIZE_MS - now
    return {
      success: false,
      remaining: 0,
      reset: Math.ceil(timeLeft / 1000) // Retorna segundos restantes
    }
  }

  // Incrementa contador
  state.count++
  
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
    remaining: MAX_REQUESTS - state.count,
    reset: Math.ceil((state.timestamp + WINDOW_SIZE_MS - now) / 1000) // Segundos restantes
  }
} 