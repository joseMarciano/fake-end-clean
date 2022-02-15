export interface AddUserAccessRepository {
  addUserAccess: (data: AddUserAccessTokenModel) => Promise<void>
}

export interface AddUserAccessTokenModel {
  accessToken: string
  userId: string
}
