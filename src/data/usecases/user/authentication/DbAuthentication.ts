import { Encrypter } from '../../../../data/protocols/cryptography/Encrypter'
import { Authentication, AuthenticationModel } from '../../../../domain/usecases/user/authentication/Authentication'
import { FindUserByEmailRepository } from 'src/data/protocols/user/FindUserByEmailRepository'
import { HashCompare } from '../../../../data/protocols/cryptography/HashCompare'
import { UpdateUserAccessTokenRepository } from '../../../../data/protocols/user/UpdateUserAccessTokenRepository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly updateUserAccessTokenRepository: UpdateUserAccessTokenRepository
  ) {}

  async auth (authenticationModel: AuthenticationModel): Promise<string> {
    const invalidReturn = null as unknown as string

    const user = await this.findUserByEmailRepository.findByEmail(authenticationModel.email)
    if (!user) return invalidReturn

    const passwordIsValid = await this.hashCompare.compare(authenticationModel.password, user.password as string)
    if (!passwordIsValid) return invalidReturn

    const accessToken = await this.encrypter.encrypt(authenticationModel)

    await this.updateUserAccessTokenRepository.updateAccessToken({
      accessToken,
      userId: user.id,
      createdAt: new Date()
    })

    return accessToken
  }
}
