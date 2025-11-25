import { NextRequest, NextResponse } from 'next/server'
import SocialPost from '@/database/socialPost.model'
import { verifyAccessToken } from '@/lib/jwt'
import connectionToDatabase from '@/lib/mongose'
import { Types } from 'mongoose'

/**
 * GET /api/posts/[id]
 * Get a single post by ID
 */
export async function GET (
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

    const token = request.cookies.get('accessToken')?.value
    let userId = null

    if (token) {
      try {
        const decoded = await verifyAccessToken(token)
        userId = decoded.userId
      } catch (error) {
        console.log('Invalid token')
      }
    }

    const post = await SocialPost.findById(id).populate(
      'userId',
      'username email'
    )

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      )
    }

    // Check visibility permissions
    const canView =
      post.visibility === 'public' || post.userId._id.toString() === userId

    if (!canView) {
      return NextResponse.json(
        {
          success: false,
          message: 'You do not have permission to view this post'
        },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, post })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/posts/[id]
 * Update a post (only owner can update)
 */
export async function PUT (
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

    // Check if user owns the post
    if (post.userId.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: 'You can only update your own posts' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { content, visibility, tags } = body

    if (content) post.content = content
    if (visibility) post.visibility = visibility
    if (tags) post.tags = tags

    await post.save()

    const updatedPost = await SocialPost.findById(id).populate(
      'userId',
      'username email'
    )

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully',
      post: updatedPost
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/posts/[id]
 * Delete a post (only owner can delete)
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

    // Check if user owns the post
    if (post.userId.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: 'You can only delete your own posts' },
        { status: 403 }
      )
    }

    await SocialPost.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
