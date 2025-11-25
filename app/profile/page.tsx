import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { verifyAccessToken } from '@/lib/jwt'
import UserProfile from '@/components/profile/UserProfile'

export const metadata = {
  title: 'My Profile | Social X',
  description: 'View your profile, posts, and comments'
}

export default async function ProfilePage () {
  // Verify user is authenticated
  const headersList = await headers()
  const cookieHeader = headersList.get('cookie')
  let token = null

  if (cookieHeader) {
    const cookieArray = cookieHeader.split(';')
    const tokenCookie = cookieArray.find((c) =>
      c.trim().startsWith('accessToken=')
    )
    token = tokenCookie ? tokenCookie.split('=')[1] : null
  }

  if (!token) {
    redirect('/login')
  }

  try {
    await verifyAccessToken(token)
  } catch (error) {
    redirect('/login')
  }

  return <UserProfile />
}
