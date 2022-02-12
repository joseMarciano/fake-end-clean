export interface UpdateUserAccessTokenRepository {
  updateAccessToken: (data: UpdateUserAccessTokenModel) => Promise<void>
}

export interface UpdateUserAccessTokenModel {
  accessToken: string
  userId: string
  createdAt: Date
}
