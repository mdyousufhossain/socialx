import argon2 from 'argon2'

import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '@/lib/jwt'
import connectionToDatabase from './mongose'
import User from '@/database/user.model'
import RefreshTokenModel from '@/database/refreshToken.model'

export class AuthService {
  // Register new user
  // @ts-ignore

  static async register (userData) {
    const { email, password, username } = userData
    connectionToDatabase()
    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error('User already exists')
    }

    const userCount = await User.countDocuments()
    const isFirstUser = userCount === 0

    // First user becomes admin, others become users
    const role = isFirstUser ? 'admin' : 'user'

    // Hash password
    const argon2Options = {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      iterations: 3, // Number of iterations
      parallelism: 2, // Number of parallel threads
      hashLength: 32, // Increased hash length
      saltLength: 16 // Length of the salt
    }
    const hashedPassword = await argon2.hash(password, argon2Options)

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      role
    })

    return user
  }

  // Login user
  // @ts-ignore
  static async login (credentials, deviceInfo = {}) {
    const { email, password } = credentials
    connectionToDatabase()
    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.password, password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    }

    const accessToken = await generateAccessToken(tokenPayload)
    const refreshToken = await generateRefreshToken(tokenPayload)

    // Save refresh token to database
    await RefreshTokenModel.create({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      deviceInfo
    })

    return {
      accessToken,
      refreshToken,
      user: user.toJSON()
    }
  }

  // Refresh access token
  // @ts-ignore
  static async refreshToken (oldRefreshToken, deviceInfo = {}) {
    // Verify the refresh token
    const decoded = await verifyRefreshToken(oldRefreshToken)
    connectionToDatabase()
    const storedToken = await RefreshTokenModel.findOne({
      token: oldRefreshToken,
      // @ts-ignore
      userId: decoded.userId,
      isRevoked: false
    })

    if (!storedToken) {
      throw new Error('Refresh token not found or revoked')
    }

    // Remove the old refresh token (optional: you can keep it for tracking)
    await RefreshTokenModel.deleteOne({ token: oldRefreshToken })

    const tokenPayload = {
      // @ts-ignore
      userId: decoded.userId,
      // @ts-ignore
      email: decoded.email,
      // @ts-ignore
      role: decoded.role
    }

    const newAccessToken = await generateAccessToken(tokenPayload)
    const newRefreshToken = await generateRefreshToken(tokenPayload)

    // Save new refresh token
    await RefreshTokenModel.create({
      token: newRefreshToken,
      // @ts-ignore
      userId: decoded.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo
    })

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }

  // @ts-ignore
  static async logout (refreshToken) {
    connectionToDatabase()
    await RefreshTokenModel.findOneAndUpdate(
      { token: refreshToken },
      { isRevoked: true }
    )
  }

  // @ts-ignore
  static async logoutAllDevices (userId) {
    await RefreshTokenModel.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true }
    )
  }

  // Get user from token
  // @ts-ignore
  static async getUserFromToken (accessToken) {
    const decoded = await verifyAccessToken(accessToken)
    connectionToDatabase()
    // @ts-ignore
    const user = await User.findById(decoded.userId)
    return user
  }
}
