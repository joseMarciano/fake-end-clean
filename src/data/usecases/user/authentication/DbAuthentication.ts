import { Encrypter } from '../../../../data/protocols/cryptography/Encrypter'
import { Authentication, AuthenticationModel } from '../../../../domain/usecases/user/authentication/Authentication'
import { FindUserByEmailRepository } from 'src/data/protocols/user/FindUserByEmailRepository'
import { HashCompare } from '../../../../data/protocols/cryptography/HashCompare'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashCompare: HashCompare
  ) {}

  async auth (authenticationModel: AuthenticationModel): Promise<string> {
    const invalidReturn = null as unknown as string
    const user = await this.findUserByEmailRepository.findByEmail(authenticationModel.email)

    if (!user) return invalidReturn

    const passwordIsValid = await this.hashCompare.compare(authenticationModel.password, user.password as string)

    if (!passwordIsValid) return invalidReturn

    return await this.encrypter.encrypt(authenticationModel)
  }
}
