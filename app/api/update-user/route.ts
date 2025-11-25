import { NextRequest, NextResponse } from 'next/server'
import User from '@/database/user.model'
import connectionToDatabase from '@/lib/mongose'

export async function PATCH (req: NextRequest) {
  try {
    await connectionToDatabase()
    const body = await req.json()
    const { id, data } = body

    if (!id || !data) {
      return NextResponse.json(
        { success: false, error: 'User ID and data are required' },
        { status: 400 }
      )
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user'
      },
      { status: 500 }
    )
  }
}
