import { Encrypter } from '../../../../data/protocols/cryptography/Encrypter'
import { Authentication, AuthenticationModel } from '../../../../domain/usecases/user/authentication/Authentication'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly encrypter: Encrypter
  ) {}

  async auth (authenticationModel: AuthenticationModel): Promise<string> {
    await this.encrypter.encrypt(authenticationModel)
    return await Promise.resolve('')
  }
}
