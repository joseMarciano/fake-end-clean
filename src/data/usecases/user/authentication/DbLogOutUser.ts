import { LogOutUser } from '../../../../domain/usecases/user/authentication/LogOutUser'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { DeleteUserAccessTokensByUserIdRepository } from '../../../protocols/user/DeleteUserAccessTokensByUserIdRepository'
import { DeleteUserRefreshTokensByUserIdRepository } from 'src/data/protocols/user/DeleteUserRefreshTokensByUserIdRepository'

export class DbLogOutUser implements LogOutUser {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly deleteUserAccessTokensByUserId: DeleteUserAccessTokensByUserIdRepository,
    private readonly deleteUserRefreshTokensByUserId: DeleteUserRefreshTokensByUserIdRepository
  ) {}

  async logout (token: string): Promise<void> {
    const result = await this.decrypter.decrypt(token)

    if (!result || !result.id) {
      return
    }

    await this.deleteUserAccessTokensByUserId.deleteAccessTokensByUserId(result.id)
    await this.deleteUserRefreshTokensByUserId.deleteRefreshTokensByUserId(result.id)
  }
}
