import { UserRefreshToken } from '../../../domain/model/User'

export interface FindRefreshTokenByValueRepository {
  findRefreshTokenByValue: (refreshToken: string) => Promise<UserRefreshToken>
}
