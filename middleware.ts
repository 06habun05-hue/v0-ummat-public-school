import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { stackServerApp } from '@/lib/stack'

export async function middleware(request: NextRequest) {
  // In Next.js middleware, we can check auth state
  // Some Stack setups prefer checking cookies directly if getUser() uses headers()
  const user = await stackServerApp.getUser()
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')

  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.jpg).*)'],
}
