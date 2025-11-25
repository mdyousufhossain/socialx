import { NextRequest, NextResponse } from 'next/server'
import SocialPost from '@/database/socialPost.model'
import { verifyAccessToken } from '@/lib/jwt'
import connectionToDatabase from '@/lib/mongose'
import { Types } from 'mongoose'

/**
 * POST /api/posts/[id]/likes
 * Like a post (authenticated users only)
 */
export async function POST (
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectionToDatabase()

    const { id } = params
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid post ID' },
        { status: 400 }
      )
    }

    // Verify authentication
    const token = request.cookies.get('accessToken')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    let userId
    try {
      const decoded = await verifyAccessToken(token)
      userId = decoded.userId
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }

    const post = await SocialPost.findById(id)
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user already liked the post
    const alreadyLiked = post.likes.some(
      (like: any) => like.userId.toString() === userId
    )

    if (alreadyLiked) {
      return NextResponse.json(
        { success: false, message: 'You already liked this post' },
        { status: 400 }
      )
    }

    // Add like
    post.likes.push({
      // @ts-ignore
      userId: new Types.ObjectId(userId),
      createdAt: new Date()
    })

    await post.save()

    const updatedPost = await SocialPost.findById(id).populate(
      'userId',
      'username email'
    )

    return NextResponse.json({
      success: true,
      message: 'Post liked successfully',
      likes: updatedPost.likes.length
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/posts/[id]/likes
 * Unlike a post
 */
export async function DELETE (
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectionToDatabase()

    const { id } = params
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid post ID' },
        { status: 400 }
      )
    }

    // Verify authentication
    const token = request.cookies.get('accessToken')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    let userId
    try {
      const decoded = await verifyAccessToken(token)
      userId = decoded.userId
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }

    const post = await SocialPost.findById(id)
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      )
    }

    // Remove like
    post.likes = post.likes.filter(
      (like: any) => like.userId.toString() !== userId
    )
    await post.save()

    const updatedPost = await SocialPost.findById(id).populate(
      'userId',
      'username email'
    )

    return NextResponse.json({
      success: true,
      message: 'Post unliked successfully',
      likes: updatedPost.likes.length
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
