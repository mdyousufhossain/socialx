import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_ACCESS_SECRET = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET || 'your-access-secret-change-in-production'
)

// Define public routes
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/unauthorized',
  '/policy',
  '/terms',
  '/about',
  '/contract'
]

interface JWTPayload {
  userId: string;
  role: string;
  email: string;
}
// @ts-ignore
async function verifyTokenEdge (token): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_ACCESS_SECRET)
    // @ts-ignore
    return payload as JWTPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    throw new Error('Invalid token')
  }
}

export async function middleware (req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => {
    // Check for exact match for the root route
    if (route === '/') {
      return pathname === '/'
    }
    // Use startsWith for all other public routes
    return pathname.startsWith(route)
  })

  if (isPublicRoute) {
    return NextResponse.next()
  }

  const accessToken = req.cookies.get('accessToken')?.value

  // No token - redirect to login
  if (!accessToken) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  let decoded
  try {
    decoded = await verifyTokenEdge(accessToken)
  } catch (error) {
    console.error('Middleware auth error:', error)
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('error', 'session_expired')
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access
  if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  if (pathname.startsWith('/editor') && !['editor', 'admin'].includes(decoded.role)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  // Add user info to headers
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-user-id', decoded.userId)
  requestHeaders.set('x-user-role', decoded.role)
  requestHeaders.set('x-user-email', decoded.email)

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  })
}

export const config = {
  matcher: [
    // Exclude all paths that start with an underscore,
    // are API routes, or are static files like images, fonts, etc.
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$|.*\\.svg$|.*\\.woff2$|.*\\.woff$|.*\\.ttf$|.*\\.eot$|.*\\.otf$).*)'
  ]
}
