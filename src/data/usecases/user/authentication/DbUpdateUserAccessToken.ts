import { UpdateAccessTokenError } from '../../../../domain/usecases/user/validations/UpdateAccessTokenError'
import { UpdateUserAccessToken } from '../../../../domain/usecases/user/authentication/UpdateUserAccessToken'
import { FindRefreshTokenByValueRepository } from '../../../../data/protocols/user/FindRefreshTokenByValueRepository'
import { FindUserByIdRepository } from '../../../../data/protocols/user/FindUserByIdRepository'
import { Encrypter } from '../../../../data/protocols/cryptography/Encrypter'
import { AddUserAccessRepository } from '../../../../data/protocols/user/AddUserAccessRepository'

export class DbUpdateUserAccessToken implements UpdateUserAccessToken {
  constructor (
    private readonly findRefreshTokenByValueRepository: FindRefreshTokenByValueRepository,
    private readonly findUserByIdRepository: FindUserByIdRepository,
    private readonly encrypter: Encrypter,
    private readonly addUserAccessRepository: AddUserAccessRepository
  ) {}

  async updateUserAccessToken (refreshToken: string): Promise<string | UpdateAccessTokenError> {
    const userRefreshToken = await this.findRefreshTokenByValueRepository.findRefreshTokenByValue(refreshToken)

    if (!userRefreshToken) return new UpdateAccessTokenError('Refreshtoken expired')

    const user = await this.findUserByIdRepository.findById(userRefreshToken.userId)

    if (!user) return new UpdateAccessTokenError()

    const accessToken = await this.encrypter.encrypt({
      id: user.id,
      email: user.email
    })

    await this.addUserAccessRepository.addUserAccess({
      userId: user.id,
      accessToken
    })

    return accessToken
  }
}
