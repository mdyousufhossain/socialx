export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user'
}

// Define the role hierarchy for comparison
export const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 3,
  [ROLES.EDITOR]: 2,
  [ROLES.USER]: 1
}
