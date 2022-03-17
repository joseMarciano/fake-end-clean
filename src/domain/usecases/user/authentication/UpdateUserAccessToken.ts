export interface UpdateUserAccessToken {
  updateUserAccessToken: (refreshToken: string) => Promise<string>
}
