import { Schema, Document, model, models } from 'mongoose'

/**
 * User roles for authorization.
 */
// @ts-ignore

/**
 * Interface representing a User document.
*/
export interface IUser extends Document {
  username: string
  email: string
  password: string
  role: string
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

/**
 * Mongoose schema for the User model.
 */
const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
      match: [
        /^\w+$/,
        'Username can only contain letters, numbers, and underscores'
      ]
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email must be a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long']
    },
    role: {
      type: String,
      enum: ['user', 'editor', 'admin'],
      default: 'user'
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

const User = models.User || model<IUser>('User', UserSchema)
export default User
