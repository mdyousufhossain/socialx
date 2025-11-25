import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/authService'
import connectionToDatabase from '@/lib/mongose'

export async function POST (req: NextRequest) {
  try {
    await connectionToDatabase()

    const refreshToken = req.cookies.get('refreshToken')?.value

    if (refreshToken) {
      await AuthService.logout(refreshToken)
    }

    const response = NextResponse.json({ message: 'Logged out successfully' })

    // Clear cookies
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')

    return response
  } catch (error) {
    console.error('Logout error:', error)

    // Still clear cookies even if there's an error
    const response = NextResponse.json({ message: 'Logged out successfully' })
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')

    return response
  }
}
