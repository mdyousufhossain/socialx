import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/authService'
import connectionToDatabase from '@/lib/mongose'
// import { setTokensServer } from '@/lib/tokenStorage'

// Mark route as dynamic - required because we access request.cookies
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    connectionToDatabase()
    const credentials = await req.json()

    const deviceInfo = {
      userAgent: req.headers.get('user-agent'),
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
    }

    const result = await AuthService.login(credentials, deviceInfo)

    const response = NextResponse.json({
      user: result.user,
      message: 'Login successful',
    })
    // Set HTTP-only cookies
    response.cookies.set('accessToken', result.accessToken, {
      httpOnly: true, // Prevents client-side JS access (HIGH SECURITY)
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict', // Protects against CSRF
      maxAge: 900, // 15 minutes (in seconds)
      path: '/', // Accessible across the whole application
    })

    // --- 4. Set the Refresh Token (Long-lived) ---
    response.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800, // 7 days (in seconds)
      path: '/api/auth/refresh', // 🔑 Restricted to only the refresh endpoint (BEST PRACTICE)
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
