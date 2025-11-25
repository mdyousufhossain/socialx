import { NextRequest, NextResponse } from 'next/server'
import SocialPost from '@/database/socialPost.model'
import { verifyAccessToken } from '@/lib/jwt'
import connectionToDatabase from '@/lib/mongose'
import { Types } from 'mongoose'

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

    let userId, email
    try {
      const decoded = await verifyAccessToken(token)
      userId = decoded.userId
      email = decoded.email
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, username } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Comment content is required' },
        { status: 400 }
      )
    }

    const post = await SocialPost.findById(id)
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      )
    }

    // Add comment
    const comment = {
    // @ts-ignore
      userId: new Types.ObjectId(userId),
      username: username || email,
      content,
      likes: []
    }

    post.comments.push(comment as any)
    await post.save()

    const updatedPost = await SocialPost.findById(id).populate(
      'userId',
      'username email'
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Comment added successfully',
        post: updatedPost
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/posts/[id]/comments/[commentId]
 */
export async function DELETE (
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectionToDatabase()

    const { id } = params
    const url = new URL(request.url)
    const commentId = url.searchParams.get('commentId')

    if (
      !Types.ObjectId.isValid(id) ||
      !commentId ||
      !Types.ObjectId.isValid(commentId)
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid post or comment ID' },
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

    const comment = post.comments.id(commentId)
    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      )
    }

    // Check if user owns the comment
    if (comment.userId.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: 'You can only delete your own comments' },
        { status: 403 }
      )
    }

    post.comments.id(commentId).deleteOne()
    await post.save()

    const updatedPost = await SocialPost.findById(id).populate(
      'userId',
      'username email'
    )

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
      post: updatedPost
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
