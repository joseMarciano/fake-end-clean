import { FindUserByEmailRepository } from 'src/data/protocols/user/FindUserByEmailRepository'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { AuthByToken } from '../../../../domain/usecases/user/authentication/AuthByToken'

export class DbAuthByToken implements AuthByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly findUserByEmailRespository: FindUserByEmailRepository
  ) {}

  async authByToken (token: string): Promise<boolean> {
    const isAuthenticated = false
    const decrypted = await this.decrypter.decrypt(token)

    if (!decrypted) return isAuthenticated

    await this.findUserByEmailRespository.findByEmail(decrypted.email)
    return await Promise.resolve(null as any)
  }
}
