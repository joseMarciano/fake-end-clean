export interface UpdateUserRefreshTokenRepository {
  updateRefreshToken: (data: UpdateUserRefreshTokenModel) => Promise<void>
}

export interface UpdateUserRefreshTokenModel {
  accessToken: string
  userId: string
  createdAt: Date
}
