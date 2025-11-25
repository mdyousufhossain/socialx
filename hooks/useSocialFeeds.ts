'use client'
import { useState, useCallback } from 'react'

export interface PostData {
  content: string
  visibility: 'public' | 'private'
  media?: Array<{ type: 'image' | 'video'; url: string; alt?: string }>
  tags?: string[]
  username?: string
}

export const useSocialFeeds = () => {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/posts', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      setPosts(data.posts)
      return data.posts
    } catch (err: any) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const createPost = useCallback(
    async (postData: PostData) => {
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(postData)
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message)
        }

        const data = await response.json()
        setPosts([data.post, ...posts])
        return data.post
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [posts]
  )

  const deletePost = useCallback(
    async (postId: string) => {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Failed to delete post')
        }

        setPosts(posts.filter((p) => p._id !== postId))
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [posts]
  )

  const updatePost = useCallback(
    async (
      postId: string,
      updates: { content?: string; visibility?: string; tags?: string[] }
    ) => {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(updates)
        })

        if (!response.ok) {
          throw new Error('Failed to update post')
        }

        const data = await response.json()
        setPosts(posts.map((p) => (p._id === postId ? data.post : p)))
        return data.post
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [posts]
  )

  const likePost = useCallback(async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to like post')
      }

      return await response.json()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const unlikePost = useCallback(async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to unlike post')
      }

      return await response.json()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const addComment = useCallback(
    async (
      postId: string,
      commentData: { content: string; username?: string }
    ) => {
      try {
        const response = await fetch(`/api/posts/${postId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(commentData)
        })

        if (!response.ok) {
          throw new Error('Failed to add comment')
        }

        return await response.json()
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    []
  )

  const deleteComment = useCallback(
    async (postId: string, commentId: string) => {
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

        return await response.json()
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    []
  )

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    deletePost,
    updatePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment
  }
}
