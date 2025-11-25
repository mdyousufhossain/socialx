import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/authService'
import { setTokensServer } from '@/lib/tokenStorage'

// Mark route as dynamic - required because we access request.cookies
export const dynamic = 'force-dynamic'

export async function POST (req: NextRequest) {
  try {
    // Extract refresh token from HTTP-only cookie
    const refreshToken = req.cookies.get('refreshToken')?.value

    if (!refreshToken) {
      return NextResponse.json({ message: 'No refresh token' }, { status: 401 })
    }

    const deviceInfo = {
      userAgent: req.headers.get('user-agent'),
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown'
    }

    const result = await AuthService.refreshToken(refreshToken, deviceInfo)

    // Create response
    const response = NextResponse.json({
      message: 'Token refreshed successfully'
    })

    // Set new HTTP-only cookies
    setTokensServer({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      res: response
    })

    return response
  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
