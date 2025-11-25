import { NextRequest } from 'next/server'
import { AuthService } from '@/lib/authService'

export async function GET (req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value

    if (!accessToken) {
      return Response.json({ error: 'No token provided' }, { status: 401 })
    }

    const user = await AuthService.getUserFromToken(accessToken)

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    return Response.json(user)
  } catch (error) {
    return Response.json({ error: 'Invalid token' }, { status: 401 })
  }
}
