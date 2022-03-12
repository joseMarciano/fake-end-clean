export interface Project {
  id: string
  title: string
  description: string
  secretKey: string
  user: string
}

export const nonUpdatableFields = ['id', 'secretKey', 'createdAt', 'user']
