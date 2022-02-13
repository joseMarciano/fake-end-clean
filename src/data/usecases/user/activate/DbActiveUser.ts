import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { User } from '../../../../domain/model/User'
import { ActivateUser, ActivateUserModel } from '../../../../domain/usecases/user/activate/ActivateUser'

export class DbActiveUser implements ActivateUser {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async active (userActivateModel: ActivateUserModel): Promise<User> {
    await this.decrypter.decrypt(userActivateModel.encryptedValue)

    return await Promise.resolve({
      id: 'ant',
      email: 'as',
      isActive: true,
      name: 'asda',
      password: 'asda'
    })
  }
}
