import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18nConfig } from '@/messages/i18n-config'
import { checkRateLimit } from '@/lib/rate-limit'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = i18nConfig.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  const locale = pathname.split('/')[1] || i18nConfig.defaultLocale

  if (pathnameIsMissingLocale) {
    const preferredLocale = request.headers.get('accept-language')?.split(',')[0].split('-')[0] || i18nConfig.defaultLocale

    return NextResponse.redirect(
      new URL(
        `/${preferredLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    )
  }

  if (pathname.includes('/reset-password')) {
    const identifier = request.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous'
    const { success, remaining, reset } = await checkRateLimit(identifier)

    if (!success) {
      const minutes = Math.ceil(reset / 60)
      
      return NextResponse.redirect(
        new URL(
          `/${locale}/rate-limit?minutes=${minutes}`,
          request.url
        )
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|legal|favicon.ico|.*\\..*|_vercel|[0-9a-f]{32}).*)',
    '/reset-password/:path*'
  ],
}
