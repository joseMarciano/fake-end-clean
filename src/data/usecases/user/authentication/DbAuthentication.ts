import { Encrypter } from '../../../../data/protocols/cryptography/Encrypter'
import { Authentication, AuthenticationModel } from '../../../../domain/usecases/user/authentication/Authentication'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { HashCompare } from '../../../../data/protocols/cryptography/HashCompare'
import { AddUserAccessRepository } from '../../../../data/protocols/user/AddUserAccessRepository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly addUserAccessRepository: AddUserAccessRepository
  ) {}

  async auth (authenticationModel: AuthenticationModel): Promise<string> {
    const invalidReturn = null as unknown as string

    const user = await this.findUserByEmailRepository.findByEmail(authenticationModel.email)
    if (!user) return invalidReturn

    const passwordIsValid = await this.hashCompare.compare(authenticationModel.password, user.password as string)
    if (!passwordIsValid) return invalidReturn

    const accessToken = await this.encrypter.encrypt({
      email: user.email,
      password: user.password
    })

    await this.addUserAccessRepository.addUserAccess({
      accessToken,
      userId: user.id
    })

    return accessToken
  }
}
