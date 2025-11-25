import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/authService'
import connectionToDatabase from '@/lib/mongose'

export async function POST (req: NextRequest) {
  try {
    connectionToDatabase()
    const userData = await req.json()
    // Use AuthService for registration logic
    const user = await AuthService.register(userData)

    return Response.json({
      user: user.toJSON(),
      message: 'Registration successful'
    })
  } catch (error) {
    console.error('Error during user registration:', error)
    return NextResponse.json(
      { error: 'Server error during registration' },
      { status: 500 }
    )
  }
}
