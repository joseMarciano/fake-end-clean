export interface User {
  id: string
  email: string
  name: string
  isActive: boolean
  password?: string
}

export interface UserAccessToken {
  accessToken: string
  userId: string
  createdAt: Date
}
