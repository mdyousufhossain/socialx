'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, Share2, Trash2, Loader } from 'lucide-react'
import Image from 'next/image'

interface Like {
  userId: string
  createdAt: string
}

interface Comment {
  _id: string
  userId: string
  username: string
  content: string
  likes: Like[]
  createdAt: string
}

interface Media {
  url: string
  type: 'image' | 'video'
  alt?: string
}

interface Post {
  _id: string
  userId: { _id: string; username: string; email: string }
  username: string
  content: string
  media: Media[]
  likes: Like[]
  comments: Comment[]
  visibility: 'public' | 'private'
  createdAt: string
  shares: number
}

const formatTimeAgo = (date: string): string => {
  const now = new Date()
  const postDate = new Date(date)
  const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

  return postDate.toLocaleDateString()
}

export default function UserProfile () {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [showComments, setShowComments] = useState<Set<string>>(new Set())

  // Fetch user's posts
  useEffect(() => {
    if (!isAuthenticated || !user) return

    const fetchUserPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/posts?myPosts=true', {
          credentials: 'include'
        })

        if (!response.ok) throw new Error('Failed to fetch posts')

        const data = await response.json()
        const posts = data.posts || []
        setUserPosts(posts)

        // Initialize liked posts
        const liked = new Set<string>()
        for (const post of posts) {
          if (post.likes.some((like: Like) => like.userId === user.id)) {
            liked.add(post._id)
          }
        }
        setLikedPosts(liked)
      } catch (error) {
        console.error('Failed to fetch user posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserPosts()
  }, [isAuthenticated, user])

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      setDeleting(postId)
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) throw new Error('Failed to delete post')

      setUserPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      )
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete post')
    } finally {
      setDeleting(null)
    }
  }

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(
        `/api/posts/${postId}/comments?commentId=${commentId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      if (!response.ok) throw new Error('Failed to delete comment')

      setUserPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.filter((c) => c._id !== commentId)
            }
          }
          return post
        })
      )
    } catch (error) {
      console.error('Delete comment failed:', error)
      alert('Failed to delete comment')
    }
  }

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) {
      alert('Please login to like posts')
      return
    }

    try {
      const isLiked = likedPosts.has(postId)

      // Optimistic update
      const newLiked = new Set(likedPosts)
      if (isLiked) {
        newLiked.delete(postId)
      } else {
        newLiked.add(postId)
      }
      setLikedPosts(newLiked)

      // API call
      const method = isLiked ? 'DELETE' : 'POST'
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method,
        credentials: 'include'
      })

      if (!response.ok) {
        // Revert on error
        setLikedPosts(likedPosts)
      }
    } catch (error) {
      console.error('Like failed:', error)
      setLikedPosts(likedPosts)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
        <div className='w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900'>
            Access Denied
          </h2>
          <p className='mb-6 text-gray-600'>
            Please login to view your profile
          </p>
          <button
            onClick={() => router.push('/login')}
            className='w-full rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700'
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const totalComments = userPosts.reduce(
    (sum, post) => sum + post.comments.length,
    0
  )

  return (
    <div className='min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-2xl'>
        {/* Profile Header */}
        <div className='mb-8 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200'>
          <div className='flex flex-col gap-6 p-8 sm:flex-row sm:items-center'>
            <div className='flex size-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700'>
              <span className='text-4xl font-bold text-white'>
                {user?.username?.charAt(0).toUpperCase() ||
                  user?.email?.charAt(0).toUpperCase() ||
                  'U'}
              </span>
            </div>
            <div className='flex-1'>
              <h1 className='mb-2 text-3xl font-bold text-gray-900'>
                {user?.username || user?.email?.split('@')[0] || 'User'}
              </h1>
              <p className='mb-4 text-gray-600'>{user?.email}</p>
              <div className='flex gap-6 text-sm text-gray-600'>
                <div>
                  <span className='font-bold text-gray-900'>
                    {userPosts.length}
                  </span>
                  <span> Posts</span>
                </div>
                <div>
                  <span className='font-bold text-gray-900'>
                    {totalComments}
                  </span>
                  <span> Comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className='space-y-6'>
          <h2 className='text-2xl font-bold text-gray-900'>Your Posts</h2>

          {loading && (
            <div className='flex justify-center py-12'>
              <Loader className='size-8 animate-spin text-blue-600' />
            </div>
          )}

          {!loading && userPosts.length === 0 && (
            <div className='rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-200'>
              <p className='mb-4 text-lg text-gray-600'>
                No posts yet. Start sharing!
              </p>
              <button
                onClick={() => router.push('/feeds')}
                className='rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700'
              >
                Create Post
              </button>
            </div>
          )}

          {!loading &&
            userPosts.map((post) => (
              <div
                key={post._id}
                className='overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:shadow-md'
              >
                {/* Post Header */}
                <div className='border-b border-gray-100 px-6 py-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-semibold text-gray-900'>You</p>
                      <p className='text-xs text-gray-500'>
                        {formatTimeAgo(post.createdAt)}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          post.visibility === 'public'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {post.visibility === 'public'
                          ? '🌐 Public'
                          : '🔒 Private'}
                      </span>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        disabled={deleting === post._id}
                        className='rounded-lg p-2 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50'
                        title='Delete post'
                      >
                        {deleting === post._id
                          ? (
                          <Loader
                            size={18}
                            className='animate-spin text-red-600'
                          />
                            )
                          : (
                          <Trash2 size={18} className='text-red-600' />
                            )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className='px-6 py-4'>
                  <p className='whitespace-pre-wrap text-gray-800'>
                    {post.content}
                  </p>
                </div>

                {/* Post Media */}
                {post.media && post.media.length > 0 && (
                  <div className='bg-gray-50 px-6 py-4'>
                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                      {post.media.map((media, idx) => {
                        const mediaKey = `${media.url}-${idx}`
                        return (
                          <div
                            key={mediaKey}
                            className='relative overflow-hidden rounded-lg'
                          >
                            {media.type === 'image'
                              ? (
                              <Image
                                src={media.url}
                                alt={media.alt || 'Post media'}
                                width={500}
                                height={400}
                                className='h-64 w-full object-cover'
                              />
                                )
                              : (
                              <video
                                src={media.url}
                                controls
                                className='h-64 w-full rounded object-cover'
                              />
                                )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Post Stats */}
                <div className='border-t border-gray-100 bg-gray-50 px-6 py-3'>
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>
                      {post.likes.length === 0
                        ? ''
                        : `${post.likes.length} Like${
                            post.likes.length === 1 ? '' : 's'
                          }`}
                    </span>
                    <span>
                      {post.comments.length === 0
                        ? ''
                        : `${post.comments.length} Comment${
                            post.comments.length === 1 ? '' : 's'
                          }`}
                    </span>
                    <span>
                      {post.shares === 0
                        ? ''
                        : `${post.shares} Share${post.shares === 1 ? '' : 's'}`}
                    </span>
                  </div>
                </div>

                {/* Post Actions */}
                <div className='flex gap-1 px-5 py-3 sm:px-6'>
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-medium transition ${
                      likedPosts.has(post._id)
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Heart
                      size={20}
                      fill={likedPosts.has(post._id) ? 'currentColor' : 'none'}
                      className='transition'
                    />
                    Like
                  </button>
                  <button
                    onClick={() => {
                      const current = new Set(showComments)
                      if (current.has(post._id)) {
                        current.delete(post._id)
                      } else {
                        current.add(post._id)
                      }
                      setShowComments(current)
                    }}
                    className='flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-medium text-gray-600 transition hover:bg-gray-100'
                  >
                    <MessageCircle size={20} />
                    Comment
                  </button>
                  <button
                    disabled
                    className='flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    <Share2 size={20} />
                    Share
                  </button>
                </div>

                {/* Comments Section */}
                {showComments.has(post._id) && (
                  <div className='border-t border-gray-100 bg-gray-50 px-6 py-4'>
                    <h4 className='mb-4 font-semibold text-gray-900'>
                      Comments
                    </h4>

                    {post.comments.length === 0
                      ? (
                      <p className='py-4 text-center text-sm text-gray-500'>
                        No comments yet
                      </p>
                        )
                      : (
                      <div className='space-y-3'>
                        {post.comments.map((comment) => (
                          <div
                            key={comment._id}
                            className='rounded-lg border border-gray-200 bg-white p-3'
                          >
                            <div className='mb-2 flex items-start justify-between gap-2'>
                              <div>
                                <p className='text-sm font-semibold text-gray-900'>
                                  {comment.username}
                                </p>
                                <p className='text-xs text-gray-500'>
                                  {formatTimeAgo(comment.createdAt)}
                                </p>
                              </div>
                              {comment.userId === user?.id && (
                                <button
                                  onClick={() =>
                                    handleDeleteComment(post._id, comment._id)
                                  }
                                  className='rounded p-1 transition hover:bg-red-50'
                                  title='Delete comment'
                                >
                                  <Trash2 size={14} className='text-red-600' />
                                </button>
                              )}
                            </div>
                            <p className='text-sm text-gray-700'>
                              {comment.content}
                            </p>
                            {comment.likes.length > 0 && (
                              <p className='mt-2 text-xs text-gray-500'>
                                ❤️ {comment.likes.length}{' '}
                                {comment.likes.length === 1 ? 'like' : 'likes'}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                        )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
