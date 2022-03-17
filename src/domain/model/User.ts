export interface User {
  id: string
  email: string
  name: string
  isActive: boolean
  password?: string
}

export interface UserAccessToken {
  id: string
  accessToken: string
  userId: string
  createdAt: Date
}
export interface UserRefreshToken {
  id: string
  refreshToken: string
  userId: string
  createdAt: Date
}
