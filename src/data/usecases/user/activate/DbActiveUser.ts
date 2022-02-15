import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { User } from '../../../../domain/model/User'
import { ActivateUser, ActivateUserModel } from '../../../../domain/usecases/user/activate/ActivateUser'
import { ActiveUserByIdRepository } from '../../../../data/protocols/user/ActiveUserByIdRepository'

export class DbActiveUser implements ActivateUser {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly activeUserByIdRepository: ActiveUserByIdRepository
  ) {}

  async active (userActivateModel: ActivateUserModel): Promise<User> {
    const decrypt = await this.decrypter.decrypt(userActivateModel.encryptedValue)

    if (!decrypt) return null as any

    const { id } = await this.findUserByEmailRepository.findByEmail(decrypt.email)
    return await this.activeUserByIdRepository.activeById(id)
  }
}
