export interface DeleteUserRefreshTokensByUserIdRepository {
  deleteRefreshTokensByUserId: (userId: string) => Promise<void>
}
