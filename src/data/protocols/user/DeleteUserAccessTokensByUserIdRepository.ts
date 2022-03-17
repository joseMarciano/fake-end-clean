export interface DeleteUserAccessTokensByUserIdRepository {
  deleteAccessTokensByUserId: (userId: string) => Promise<void>
}
