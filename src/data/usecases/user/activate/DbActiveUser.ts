import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { User } from '../../../../domain/model/User'
import { ActivateUser, ActivateUserModel } from '../../../../domain/usecases/user/activate/ActivateUser'

export class DbActiveUser implements ActivateUser {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly findUserByEmailRepository: FindUserByEmailRepository
  ) {}

  async active (userActivateModel: ActivateUserModel): Promise<User> {
    const { email } = await this.decrypter.decrypt(userActivateModel.encryptedValue)

    await this.findUserByEmailRepository.findByEmail(email)

    return await Promise.resolve({
      id: 'ant',
      email: 'as',
      isActive: true,
      name: 'asda',
      password: 'asda'
    })
  }
}
