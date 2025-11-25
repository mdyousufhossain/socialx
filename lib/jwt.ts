/* eslint-disable space-before-function-paren */
import { SignJWT, jwtVerify } from 'jose'
import { ROLE_HIERARCHY } from './config/roles'

const JWT_ACCESS_SECRET = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET || 'your-access-secret-change-in-production'
)

const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-change-in-production'
)

// @ts-ignore
export async function generateAccessToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_ACCESS_SECRET)
}
// @ts-ignore
export async function generateRefreshToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_REFRESH_SECRET)
}
// @ts-ignore
export async function verifyAccessToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_ACCESS_SECRET)
    return payload
  } catch (error) {
    console.error('Access token verification failed:', error)
    throw new Error('Invalid access token')
  }
}

// @ts-ignore
export async function verifyRefreshToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET)
    return payload
  } catch (error) {
    console.error('Refresh token verification failed:', error)
    throw new Error('Invalid refresh token')
  }
}

export function hasRequiredRole
// @ts-ignore
(userRole, requiredRole) {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export function hasExactRole
// @ts-ignore
(userRole, requiredRole) {
  return userRole === requiredRole
}

export function hasAnyRole
// @ts-ignore
(userRole, allowedRoles) {
  return allowedRoles.includes(userRole)
}
