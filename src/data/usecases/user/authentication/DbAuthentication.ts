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
    const user = await this.findUserByEmailRepository.findByEmail(authenticationModel.email)

    if (user) {
      await this.hashCompare.compare(authenticationModel.password, user.password as string)
    }
    await this.encrypter.encrypt(authenticationModel)

    return await Promise.resolve('')
  }
}
