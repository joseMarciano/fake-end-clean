import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { AuthByToken } from '../../../../domain/usecases/user/authentication/AuthByToken'

export class DbAuthByToken implements AuthByToken {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async authByToken (token: string): Promise<boolean> {
    await this.decrypter.decrypt(token)
    return await Promise.resolve(true)
  }
}
