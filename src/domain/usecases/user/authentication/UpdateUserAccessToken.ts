import { UpdateAccessTokenError } from '../validations/UpdateAccessTokenError'

export interface UpdateUserAccessToken {
  updateUserAccessToken: (refreshToken: string) => Promise<string | UpdateAccessTokenError>
}
