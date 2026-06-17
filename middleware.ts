import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // In Next.js middleware, we can check auth state
  // TODO: Implement Neon Auth server-side verification using their Node/Edge SDK.
  // For now, we allow the request to proceed so Neon Auth components can handle client-side auth.
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.jpg).*)'],
}
