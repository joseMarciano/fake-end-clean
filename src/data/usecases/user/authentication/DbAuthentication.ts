import { Encrypter } from '../../../../data/protocols/cryptography/Encrypter'
import { Authentication, AuthenticationModel } from '../../../../domain/usecases/user/authentication/Authentication'
import { FindUserByEmailRepository } from 'src/data/protocols/user/FindUserByEmailRepository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly findUserByEmailRepository: FindUserByEmailRepository
  ) {}

  async auth (authenticationModel: AuthenticationModel): Promise<string> {
    await this.findUserByEmailRepository.findByEmail(authenticationModel.email)

    await this.encrypter.encrypt(authenticationModel)

    return await Promise.resolve('')
  }
}
