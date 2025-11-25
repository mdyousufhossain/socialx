import mongoose, { Document, model, models, Schema, Types } from 'mongoose'

export interface IDeviceInfo {
  userAgent?: string
  ipAddress?: string
}

export interface IRefreshToken extends Document {
  token: string
  userId: Types.ObjectId
  expiresAt: Date
  deviceInfo?: IDeviceInfo
  isRevoked: boolean
  createdAt?: Date
  updatedAt?: Date
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    deviceInfo: {
      userAgent: { type: String },
      ipAddress: { type: String }
    },
    isRevoked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

// refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
/**
 * const Product = models.Product || model<IProduct>('Product', productSchema)

export default Product
 */
const RefreshTokenModel = models.RefreshToken || model<IRefreshToken>(
  'RefreshToken',
  refreshTokenSchema
)

export default RefreshTokenModel
