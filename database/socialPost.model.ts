import { Schema, Document, model, models } from 'mongoose'

/**
 * Interface for likes on a social post
 */
interface ILike {
  userId: Schema.Types.ObjectId
  createdAt: Date
}

/**
 * Interface for comments on a social post
 */
interface IComment extends Document {
  userId: Schema.Types.ObjectId
  username: string
  content: string
  likes: ILike[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Interface representing a Social Post document
 */
export interface ISocialPost extends Document {
  userId: Schema.Types.ObjectId
  username: string
  content: string
  media?: {
    type: string
    url: string
    alt?: string
  }[]
  likes: ILike[]
  comments: IComment[]
  shares: number
  visibility: 'public' | 'private' | 'friends'
  tags: string[]
  createdAt: Date
  updatedAt: Date
  getLikeCount(): number
  getCommentCount(): number
}

/**
 * Mongoose schema for comments
 */
const CommentSchema = new Schema<IComment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    username: {
      type: String,
      required: [true, 'Username is required']
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      minlength: [1, 'Comment cannot be empty'],
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    likes: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

/**
 * Mongoose schema for social posts
 */
const SocialPostSchema = new Schema<ISocialPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      minlength: [1, 'Post content cannot be empty'],
      maxlength: [2000, 'Post content cannot exceed 2000 characters']
    },
    media: [
      {
        type: {
          type: String,
          enum: ['image', 'video'],
          required: true
        },
        url: {
          type: String,
          required: [true, 'Media URL is required']
        },
        alt: {
          type: String,
          default: 'Social post media'
        }
      }
    ],
    likes: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    comments: [CommentSchema],
    shares: {
      type: Number,
      default: 0,
      min: [0, 'Shares cannot be negative']
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'friends'],
      default: 'public'
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ]
  },
  {
    timestamps: true
  }
)

/**
 * Method to get total like count for a post
 */
SocialPostSchema.methods.getLikeCount = function (): number {
  return this.likes.length
}

/**
 * Method to get total comment count for a post
 */
SocialPostSchema.methods.getCommentCount = function (): number {
  return this.comments.length
}

/**
 * Index for better query performance
 */
SocialPostSchema.index({ userId: 1, createdAt: -1 })
SocialPostSchema.index({ visibility: 1, createdAt: -1 })
SocialPostSchema.index({ tags: 1 })

const SocialPost =
  models.SocialPost || model<ISocialPost>('SocialPost', SocialPostSchema)

export default SocialPost
