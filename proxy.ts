import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  const protectedRoutes = [
    '/resources/new',
    '/my-loop',
    '/profile',
  ]

  const adminRoutes = ['/admin']

  const isProtected = protectedRoutes.some(r => pathname.startsWith(r))
  const isAdmin = adminRoutes.some(r => pathname.startsWith(r))

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|images|illustrations|fonts).*)'],
}
