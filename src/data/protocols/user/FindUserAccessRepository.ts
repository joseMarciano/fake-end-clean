import { UserAccessToken } from '../../../domain/model/User'

export interface FindUserAccessRepository {
  findUserAccess: (userId: string, accessToken: string) => Promise<UserAccessToken>
}
