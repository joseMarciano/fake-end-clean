import { FindUserAccessRepository } from '../../../../data/protocols/user/FindUserAccessRepository'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { AuthByToken } from '../../../../domain/usecases/user/authentication/AuthByToken'
import { User } from '../../../../domain/model/User'
import { AuthByTokenError } from '../../../../domain/usecases/user/validations/AuthByTokenError'

export class DbAuthByToken implements AuthByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly findUserByEmailRespository: FindUserByEmailRepository,
    private readonly findUserAccessRepository: FindUserAccessRepository
  ) {}

  async authByToken (token: string): Promise<User | AuthByTokenError> {
    if (!token) return new AuthByTokenError('No token was provided')

    const decrypted = await this.decrypter.decrypt(token)
    if (!decrypted) return new AuthByTokenError('Fail on decrypt token')

    const user = await this.findUserByEmailRespository.findByEmail(decrypted.email)
    if (!user || !user.isActive) return new AuthByTokenError('No user is found/disabled')

    const userAccess = !!await this.findUserAccessRepository.findUserAccess(user.id, token)

    if (!userAccess) return new AuthByTokenError()

    return user
  }
}
