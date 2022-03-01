export interface AddUserRefreshTokenRepository {
  addRefreshToken: (data: AddUserRefreshTokenModel) => Promise<void>
}

export interface AddUserRefreshTokenModel {
  refreshToken: string
  userId: string
}
