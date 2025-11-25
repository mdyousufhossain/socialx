import { NextRequest, NextResponse } from 'next/server'
import SocialPost from '@/database/socialPost.model'
import { verifyAccessToken } from '@/lib/jwt'
import connectionToDatabase from '@/lib/mongose'

/**
 * GET /api/posts
 * Get all public posts + authenticated user's private posts
 * Query params:
 * - myPosts=true: Only fetch current user's posts
 */
export async function GET (request: NextRequest) {
  try {
    await connectionToDatabase()

    const token = request.cookies.get('accessToken')?.value
    let userId = null

    // Verify token if provided
    if (token) {
      try {
        const decoded = await verifyAccessToken(token)
        userId = decoded.userId
      } catch (error) {
        // Token invalid, continue as anonymous user
      }
    }

    // Check if requesting own posts
    const url = new URL(request.url)
    const myPosts = url.searchParams.get('myPosts') === 'true'

    if (myPosts && !userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Authentication required' },
        { status: 401 }
      )
    }

    // Build query
    let query: any = {}

    if (myPosts) {
      // Only return current user's posts
      query = { userId }
    } else {
      // Return public posts + user's private posts
      query = { visibility: 'public' }
      if (userId) {
        query = {
          $or: [{ visibility: 'public' }, { userId, visibility: 'private' }]
        }
      }
    }

    const posts = await SocialPost.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(50)

    return NextResponse.json({ success: true, posts })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/posts
 * Create a new social post (authenticated users only)
 */
export async function POST (request: NextRequest) {
  try {
    await connectionToDatabase()

    // Verify authentication
    const token = request.cookies.get('accessToken')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Authentication required' },
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
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, media, visibility, tags, username } = body

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Post content is required' },
        { status: 400 }
      )
    }

    // Create post
    const post = await SocialPost.create({
      userId,
      username: username || email,
      content,
      media: media || [],
      visibility: visibility || 'public',
      tags: tags || [],
      likes: [],
      comments: [],
      shares: 0
    })

    const populatedPost = await SocialPost.findById(post._id).populate(
      'userId',
      'username email'
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Post created successfully',
        post: populatedPost
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
