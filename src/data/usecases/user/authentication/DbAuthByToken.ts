import { FindUserAccessRepository } from '../../../../data/protocols/user/FindUserAccessRepository'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { AuthByToken } from '../../../../domain/usecases/user/authentication/AuthByToken'

export class DbAuthByToken implements AuthByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly findUserByEmailRespository: FindUserByEmailRepository,
    private readonly findUserAccessRepository: FindUserAccessRepository
  ) {}

  async authByToken (token: string): Promise<boolean> {
    let isAuthenticated = false

    token = token.replace(/^Bearer/, '')?.trim()
    const decrypted = await this.decrypter.decrypt(token)
    if (!decrypted) return isAuthenticated

    const user = await this.findUserByEmailRespository.findByEmail(decrypted.email)
    if (!user) return isAuthenticated

    isAuthenticated = !!await this.findUserAccessRepository.findUserAccess(user.id, token)

    return isAuthenticated
  }
}
