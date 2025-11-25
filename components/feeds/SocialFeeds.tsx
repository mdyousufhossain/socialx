/* eslint-disable multiline-ternary */
'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Heart, MessageCircle, Share2, Trash2, Lock, Globe } from 'lucide-react'
import Image from 'next/image'
import SocialFeedsSkeleton from '../skeletons/login-page/SocialFeedsSkeleton'

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
  type: 'image' | 'video'
  url: string
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
  shares: number
  visibility: 'public' | 'private'
  tags: string[]
  createdAt: string
  updatedAt: string
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

export default function SocialFeeds () {
  const { user, isAuthenticated } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState('')
  const [visibility, setVisibility] = useState<
    'public' | 'private' | 'friends'
  >('public')
  const [posting, setPosting] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [showComments, setShowComments] = useState<Set<string>>(new Set())
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({})
  const [loadingComments, setLoadingComments] = useState<Set<string>>(new Set())
  const [likeAnimating, setLikeAnimating] = useState<Set<string>>(new Set())

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/posts', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      setPosts(data.posts)

      // Initialize liked posts
      if (isAuthenticated && user) {
        const liked = new Set<string>()
        for (const post of data.posts) {
          if (post.likes.some((like: Like) => like.userId === user.id)) {
            liked.add(post._id)
          }
        }
        setLikedPosts(liked)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Create new post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      alert('Please log in to post')
      return
    }

    if (!newPostContent.trim()) {
      alert('Post content cannot be empty')
      return
    }

    setPosting(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: newPostContent,
          visibility,
          username: user?.username || user?.email,
          media: [],
          tags: []
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      const data = await response.json()
      setPosts([data.post, ...posts])
      setNewPostContent('')
      setVisibility('public')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    } finally {
      setPosting(false)
    }
  }

  // Like/Unlike post - without refresh
  const handleLike = async (postId: string) => {
    if (!isAuthenticated) {
      alert('Please log in to like posts')
      return
    }

    const isLiked = likedPosts.has(postId)

    // Optimistic update
    const newLiked = new Set(likedPosts)
    if (isLiked) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }
    setLikedPosts(newLiked)

    // Add animation
    // @ts-ignore
    setLikeAnimating(new Set([...likeAnimating, postId]))
    setTimeout(() => {
      setLikeAnimating((prev) => {
        const next = new Set(prev)
        next.delete(postId)
        return next
      })
    }, 600)

    try {
      const method = isLiked ? 'DELETE' : 'POST'
      const endpoint = `/api/posts/${postId}/likes`

      const response = await fetch(endpoint, {
        method,
        credentials: 'include'
      })

      if (!response.ok) {
        // Revert on error
        const reverted = new Set(likedPosts)
        if (isLiked) {
          reverted.add(postId)
        } else {
          reverted.delete(postId)
        }
        setLikedPosts(reverted)
        throw new Error('Failed to update like')
      }

      // Update post likes count
      setPosts(
        posts.map((p) => {
          if (p._id === postId) {
            const updated = { ...p }
            if (isLiked) {
              updated.likes = updated.likes.filter((l) => l.userId !== user?.id)
            } else {
              updated.likes = [
                ...updated.likes,
                { userId: user?.id || '', createdAt: new Date().toISOString() }
              ]
            }
            return updated
          }
          return p
        })
      )
    } catch (error) {
      console.error('Error updating like:', error)
      alert('Failed to update like')
    }
  }

  // Delete post
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      setPosts(posts.filter((p) => p._id !== postId))
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }

  // Add comment - without full refresh
  const handleAddComment = async (postId: string) => {
    const content = newComment[postId]
    if (!content?.trim()) {
      alert('Comment cannot be empty')
      return
    }

    if (!isAuthenticated) {
      alert('Please log in to comment')
      return
    }

    // Set loading state
    // @ts-ignore
    setLoadingComments(new Set([...loadingComments, postId]))

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content,
          username: user?.username || user?.email
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add comment')
      }

      const data = await response.json()

      // Update posts with new comment
      setPosts(
        posts.map((p) => {
          if (p._id === postId) {
            return data.post
          }
          return p
        })
      )

      setNewComment({ ...newComment, [postId]: '' })
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Failed to add comment')
    } finally {
      setLoadingComments((prev) => {
        const next = new Set(prev)
        next.delete(postId)
        return next
      })
    }
  }

  // Delete comment
  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(
        `/api/posts/${postId}/comments?commentId=${commentId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      const data = await response.json()

      // Update posts with updated comments
      setPosts(
        posts.map((p) => {
          if (p._id === postId) {
            return data.post
          }
          return p
        })
      )
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Failed to delete comment')
    }
  }

  const getVisibilityIcon = (visibility: 'public' | 'private') => {
    if (visibility === 'private') {
      return <Lock size={14} className='text-red-500' />
    }
    return <Globe size={14} className='text-green-500' />
  }

  const getVisibilityText = (visibility: 'public' | 'private') => {
    if (visibility === 'private') {
      return 'Private'
    }
    return 'Public'
  }

  if (loading) {
    return <SocialFeedsSkeleton />
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100'>
      <div className='mx-auto max-w-2xl px-4 py-6 sm:py-8'>
        {/* Create Post Section */}
        {isAuthenticated
          ? (
          <div className='mb-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200'>
            <div className='border-b border-gray-100 p-6'>
              <h2 className='mb-0 text-lg font-bold text-gray-900'>
                Whats on your mind?
              </h2>
            </div>
            <form onSubmit={handleCreatePost} className='p-6'>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder='Share your thoughts...'
                className='mb-4 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-900 transition placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                rows={4}
              />

              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className='rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                >
                  <option value='public'>🌐 Public</option>
                  <option value='private'>🔒 Private</option>
                </select>

                <button
                  type='submit'
                  disabled={posting}
                  className='rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto'
                >
                  {posting
                    ? (
                    <span className='flex items-center gap-2'>
                      <div className='size-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                      Posting...
                    </span>
                      )
                    : (
                        'Post'
                      )}
                </button>
              </div>
            </form>
          </div>
            )
          : (
          <div className='mb-6 overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 ring-1 ring-blue-100'>
            <p className='text-center text-blue-900'>
              Please{' '}
              <a
                href='/login'
                className='font-bold text-blue-600 underline hover:text-blue-700'
              >
                log in
              </a>{' '}
              to post and interact with content
            </p>
          </div>
            )}

        {/* Posts Feed */}
        <div className='space-y-4'>
          {posts.length === 0 ? (
            <div className='rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-200'>
              <div className='mb-2 text-4xl'>📭</div>
              <p className='font-medium text-gray-500'>
                No posts yet. Be the first to post!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className='overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:shadow-md'
              >
                {/* Post Header */}
                <div className='border-b border-gray-100 p-5 sm:p-6'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='mb-1 flex items-center gap-2'>
                        <h3 className='text-base font-bold text-gray-900'>
                          {post.userId.username}
                        </h3>
                        <span className='inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600'>
                          {getVisibilityIcon(post.visibility)}
                          {getVisibilityText(post.visibility)}
                        </span>
                      </div>
                      <p className='text-xs text-gray-500 sm:text-sm'>
                        {formatTimeAgo(post.createdAt)}
                      </p>
                    </div>

                    {/* Delete button - only for post owner */}
                    {isAuthenticated && user?.id === post.userId._id && (
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className='rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-800'
                        title='Delete post'
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className='p-5 sm:p-6'>
                  <p className='mb-4 whitespace-pre-wrap leading-relaxed text-gray-800'>
                    {post.content}
                  </p>

                  {/* Media */}
                  {post.media && post.media.length > 0 && (
                    <div className='mb-4 grid grid-cols-1 gap-2 overflow-hidden rounded-lg'>
                      {post.media.map((media) => (
                        <div
                          key={`${post._id}-${media.url}`}
                          className='relative h-64 w-full'
                        >
                          {media.type === 'image'
                            ? (
                            <Image
                              src={media.url}
                              alt={media.alt || 'Post media'}
                              fill
                              className='object-cover'
                            />
                              )
                            : (
                            <video
                              src={media.url}
                              controls
                              className='size-full object-cover'
                            >
                              <track kind='captions' />
                            </video>
                              )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className='mb-4 flex flex-wrap gap-2'>
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className='cursor-pointer text-sm text-blue-600 hover:text-blue-700 hover:underline'
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Stats */}
                <div className='flex justify-between gap-4 border-y border-gray-100 px-5 py-3 text-sm text-gray-600 sm:px-6'>
                  <span className='cursor-default transition hover:text-gray-900'>
                    {post.likes.length === 1
                      ? '1 Like'
                      : `${post.likes.length} Likes`}
                  </span>
                  <span className='cursor-default transition hover:text-gray-900'>
                    {post.comments.length === 1
                      ? '1 Comment'
                      : `${post.comments.length} Comments`}
                  </span>
                  <span className='cursor-default transition hover:text-gray-900'>
                    {post.shares === 1 ? '1 Share' : `${post.shares} Shares`}
                  </span>
                </div>

                {/* Post Actions */}
                <div className='flex gap-1 px-5 py-3 sm:px-6'>
                  <button
                    onClick={() => handleLike(post._id)}
                    disabled={!isAuthenticated}
                    title={!isAuthenticated ? 'Please login to like posts' : ''}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-medium transition ${
                      likedPosts.has(post._id)
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    } ${
                      !isAuthenticated ? 'cursor-not-allowed opacity-50' : ''
                    } ${
                      likeAnimating.has(post._id) ? 'scale-110' : 'scale-100'
                    }`}
                    style={{
                      transitionDuration: '200ms'
                    }}
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
                    disabled={!isAuthenticated}
                    title={!isAuthenticated ? 'Please login to comment' : ''}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-medium transition ${
                      isAuthenticated
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'cursor-not-allowed text-gray-400 opacity-50'
                    }`}
                  >
                    <MessageCircle size={20} />
                    Comment
                  </button>
                  <button
                    disabled={!isAuthenticated}
                    title={
                      !isAuthenticated
                        ? 'Please login to share posts'
                        : 'Share functionality coming soon'
                    }
                    className='flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    <Share2 size={20} />
                    Share
                  </button>
                </div>

                {/* Comments Section */}
                {showComments.has(post._id) && (
                  <div className='border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-6'>
                    {/* Add Comment */}
                    {isAuthenticated && (
                      <div className='mb-4 flex gap-3'>
                        <input
                          type='text'
                          value={newComment[post._id] || ''}
                          onChange={(e) =>
                            setNewComment({
                              ...newComment,
                              [post._id]: e.target.value
                            })
                          }
                          placeholder='Write a comment...'
                          className='flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 transition placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleAddComment(post._id)
                            }
                          }}
                        />
                        <button
                          onClick={() => handleAddComment(post._id)}
                          disabled={loadingComments.has(post._id)}
                          className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                          {loadingComments.has(post._id)
                            ? (
                            <>
                              <div className='size-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                              <span className='hidden sm:inline'>
                                Posting...
                              </span>
                            </>
                              )
                            : (
                            <span>Reply</span>
                              )}
                        </button>
                      </div>
                    )}

                    {/* Display Comments */}
                    <div className='space-y-3'>
                      {post.comments.length === 0 ? (
                        <p className='py-4 text-center text-sm text-gray-500'>
                          No comments yet. Be the first!
                        </p>
                      ) : (
                        post.comments.map((comment) => (
                          <div
                            key={comment._id}
                            className='rounded-lg border border-gray-200 bg-white p-3 transition hover:shadow-sm'
                          >
                            <div className='flex items-start justify-between gap-3'>
                              <div className='flex-1'>
                                <p className='text-sm font-semibold text-gray-900'>
                                  {comment.username}
                                </p>
                                <p className='mt-1 text-sm text-gray-700'>
                                  {comment.content}
                                </p>
                                <p className='mt-2 text-xs text-gray-500'>
                                  {formatTimeAgo(comment.createdAt)}
                                </p>
                              </div>

                              {/* Delete comment button - only for comment owner */}
                              {isAuthenticated &&
                                user?.id === comment.userId && (
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(post._id, comment._id)
                                    }
                                    className='rounded-lg p-1.5 text-red-600 transition hover:bg-red-50 hover:text-red-800'
                                    title='Delete comment'
                                  >
                                    <Trash2 size={14} />
                                  </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
