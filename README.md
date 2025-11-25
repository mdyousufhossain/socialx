# Social Posting Feature Documentation

## Overview

A Facebook-like social posting system with authentication, visibility controls, and interactive features like likes and comments.

## Features

### 1. **Database Model** (`database/socialPost.model.ts`)

- **Posts**: Main social post documents
- **Comments**: Nested comments with user info and likes
- **Likes**: Track who liked posts/comments
- **Media Support**: Images and videos
- **Visibility Control**: Public, Friends, Private
- **Tags**: Hashtag support

### 2. **API Endpoints**

#### Posts Management

- **GET** `/api/posts` - Fetch all public posts + authenticated user's private posts
- **POST** `/api/posts` - Create new post (authenticated only)
- **GET** `/api/posts/[id]` - Get single post with visibility check
- **PUT** `/api/posts/[id]` - Update post (owner only)
- **DELETE** `/api/posts/[id]` - Delete post (owner only)

#### Interactions

- **POST** `/api/posts/[id]/likes` - Like a post
- **DELETE** `/api/posts/[id]/likes` - Unlike a post
- **POST** `/api/posts/[id]/comments` - Add comment
- **DELETE** `/api/posts/[id]/comments?commentId=[id]` - Delete comment

### 3. **Frontend Components**

#### SocialFeeds Component (`components/feeds/SocialFeeds.tsx`)

Main React component with:

- Post creation form (authenticated users only)
- Feed display with filtering
- Like/Unlike functionality
- Comment system (expandable)
- Delete options (for owners only)
- Visibility indicators
- Responsive design

Features:

- **Create Posts**: Only authenticated users can post
- **View Posts**: Unauthenticated users see public posts only
- **Private Access**: Authenticated users see their own private posts
- **Interactions**: Only authenticated users can like/comment
- **Ownership**: Users can only delete their own posts/comments

#### Feeds Page (`app/feeds/page.tsx`)

Server-rendered page displaying the social feeds component.

### 4. **Custom Hook** (`hooks/useSocialFeeds.ts`)

Reusable hook with methods for:

- `fetchPosts()` - Load posts from API
- `createPost(postData)` - Create new post
- `deletePost(postId)` - Delete a post
- `updatePost(postId, updates)` - Update post
- `likePost(postId)` - Like a post
- `unlikePost(postId)` - Unlike a post
- `addComment(postId, commentData)` - Add comment
- `deleteComment(postId, commentId)` - Delete comment

## Authentication & Authorization

### Public Access

- View all public posts
- Cannot post, like, or comment

### Authenticated Users

- Create posts with visibility control
- View all public posts
- View their own private/friends posts
- Like and comment on posts
- Delete only their own posts and comments

### Visibility Levels

1. **Public** (🌐) - Everyone can see
2. **Friends** (👥) - Only friends can see (currently shows as public access)
3. **Private** (🔒) - Only post owner can see

## Usage Examples

### Creating a Post

```typescript
const { createPost } = useSocialFeeds()

await createPost({
  content: 'Hello world!',
  visibility: 'public',
  tags: ['hello', 'world'],
  media: [],
})
```

### Liking a Post

```typescript
const { likePost } = useSocialFeeds()

await likePost(postId)
```

### Adding a Comment

```typescript
const { addComment } = useSocialFeeds()

await addComment(postId, {
  content: 'Great post!',
  username: 'user123',
})
```

## Security Features

1. **Authentication Check**: Token verification for protected operations
2. **Authorization**: Users can only modify their own posts/comments
3. **Visibility Control**: Posts filtered based on user permissions
4. **Input Validation**: Content length and format validation
5. **CORS**: Credentials included for secure cookie-based auth

## Installation & Setup

1. Ensure MongoDB is connected via `MONGODB_URL` environment variable
2. Database name: `testadminpanel`
3. Populate database with user data before creating posts

## Error Handling

All endpoints return:

```json
{
  "success": false,
  "message": "Error description"
}
```

Status codes:

- `200/201` - Success
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

## Future Enhancements

- Friend system implementation
- Post sharing functionality
- User profiles with post history
- Media upload integration
- Real-time notifications
- Post search and filtering
- Pagination for large datasets
- Comment like functionality
- Post edit history
