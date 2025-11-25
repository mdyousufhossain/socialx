import { ROLES } from './roles'

interface ProtectedRoutes {
  [key: string]: string[];
}

export interface RouteMatchArgs {
  requestPath: string
  routePattern: string
}

 type RequestPath = string
 type RoutePattern = string

export const routePermissions = {
  // Public routes (no authentication required)
  public: [
    '/',
    '/public',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/public/*',
    '/products/*',
    '/contract',
    '/about',
    '/policy'
  ],

  // Role-based route protection
  protected: {
    // User routes (authenticated users)
    [ROLES.USER]: [
      '/profile',
      '/settings',
      '/api/user/*'
    ],

    // Editor routes
    [ROLES.EDITOR]: [
      '/analytics',
      '/editor',
      '/editor/*',
      '/content',
      '/content/*',
      '/api/editor/*',
      '/api/content/*'
    ],

    // Admin routes
    [ROLES.ADMIN]: [
      '/admin',
      '/admin/*',
      '/users',
      '/users/*',
      '/analytics',
      '/api/admin/*',
      '/api/users/*',
      '/api/analytics/*',
      '/system',
      '/system/*'
    ]
  }
}

// Helper function to check if route matches pattern

export function matchesRoute (requestPath: RequestPath, routePattern: RoutePattern): boolean {
  if (routePattern.endsWith('/*')) {
    const basePath = routePattern.slice(0, -2)
    return requestPath.startsWith(basePath)
  }
  return requestPath === routePattern
}

export function getRequiredRole (pathname: string): string | null {
  for (const [role, routes] of Object.entries(routePermissions.protected as ProtectedRoutes)) {
    for (const route of routes) {
      if (matchesRoute(pathname, route)) {
        return role
      }
    }
  }
  return null
}

export function isPublicRoute (pathname: string): boolean {
  return routePermissions.public.some((route: string) => matchesRoute(pathname, route))
}
