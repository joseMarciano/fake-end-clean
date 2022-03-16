import { FindUserAccessRepository } from '../../../../data/protocols/user/FindUserAccessRepository'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { AuthByToken } from '../../../../domain/usecases/user/authentication/AuthByToken'
import { User } from '../../../../domain/model/User'

export class DbAuthByToken implements AuthByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly findUserByEmailRespository: FindUserByEmailRepository,
    private readonly findUserAccessRepository: FindUserAccessRepository
  ) {}

  async authByToken (token: string): Promise<User | null> {
    if (!token) return null

    const decrypted = await this.decrypter.decrypt(token)
    if (!decrypted) return null

    const user = await this.findUserByEmailRespository.findByEmail(decrypted.email)
    if (!user || !user.isActive) return null

    const userAccess = !!await this.findUserAccessRepository.findUserAccess(user.id, token)

    if (!userAccess) return null

    return user
  }
}
