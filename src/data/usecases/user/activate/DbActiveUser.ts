import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { User } from '../../../../domain/model/User'
import { ActivateUser, ActivateUserModel } from '../../../../domain/usecases/user/activate/ActivateUser'
import { ActiveUserByIdRepository } from '../../../../data/protocols/user/ActiveUserByIdRepository'
import { FindUserAccessRepository } from '../../../../data/protocols/user/FindUserAccessRepository'
import { ActivateUserError } from '../../../../domain/usecases/user/validations/ActivateUserError'

export class DbActiveUser implements ActivateUser {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly activeUserByIdRepository: ActiveUserByIdRepository,
    private readonly findUserAccessTokenRepository: FindUserAccessRepository
  ) {}

  async active (userActivateModel: ActivateUserModel): Promise<User | ActivateUserError> {
    const decrypt = await this.decrypter.decrypt(userActivateModel.encryptedValue)

    if (!decrypt) return new ActivateUserError('Error on decrypt')

    const user = await this.findUserByEmailRepository.findByEmail(decrypt.email)

    if (!user) return new ActivateUserError(`User with email ${decrypt.email as string} not found`)

    const userAccessToken = await this.findUserAccessTokenRepository.findUserAccess(user.id, userActivateModel.encryptedValue)

    if (!userAccessToken) return new ActivateUserError('Invalid access token')

    return await this.activeUserByIdRepository.activeById(userAccessToken.userId)
  }
}
