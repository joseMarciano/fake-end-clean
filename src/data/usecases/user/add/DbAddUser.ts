import { FindUserByEmailRepository } from '../../../protocols/user/FindUserByEmailRepository'
import { AddUserRepository } from '../../../protocols/user/AddUserRepository'
import { Hasher } from '../../../protocols/cryptography/Hasher'
import { User } from '../../../../domain/model/User'
import { AddUser, UserModel } from '../../../../domain/usecases/user/add/AddUser'
import { EmailInUseError } from '../../../../domain/usecases/user/validations/EmailInUseError'

export class DbAddUser implements AddUser {
  constructor (
    private readonly addUserRepository: AddUserRepository,
    private readonly hasher: Hasher,
    private readonly findUserByEmailRepository: FindUserByEmailRepository
  ) {}

  async add (user: UserModel): Promise<User | EmailInUseError> {
    const existsUser = await this.findUserByEmailRepository.findByEmail(user.email)

    if (existsUser) return new EmailInUseError(existsUser.email)

    const hasherPassword = await this.hasher.hash(user.password ?? '')
    return await this.addUserRepository.add({
      ...user,
      password: hasherPassword
    })
  }
}
