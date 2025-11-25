import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/authService'
import { setTokensServer } from '@/lib/tokenStorage'

export async function GET (req: NextRequest) {
  try {
    // Extract refresh token from HTTP-only cookie
    const refreshToken = req.cookies.get('refreshToken')?.value

    if (!refreshToken) {
      return Response.json({ message: 'No refresh token' }, { status: 401 })
    }

    const deviceInfo = {
      userAgent: req.headers.get('user-agent'),
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown'
    }

    const result = await AuthService.refreshToken(refreshToken, deviceInfo)

    // Create response
    const response = Response.json({
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
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
