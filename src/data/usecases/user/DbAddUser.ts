import { FindUserByEmailRepository } from '../../../data/protocols/FindUserByEmailRepository'
import { AddUserRepository } from '../../../data/protocols/AddUserRepository'
import { Hasher } from '../../../data/protocols/cryptography/Hasher'
import { User } from '../../../domain/model/User'
import { AddUser, UserModel } from '../../../domain/usecases/user/AddUser'
import { EmailInUseError } from '../../../domain/usecases/user/validations/EmailInUseError'

export class DbAddUser implements AddUser {
  constructor (
    private readonly addUserRepository: AddUserRepository,
    private readonly hasher: Hasher,
    private readonly findUserByEmailRepository: FindUserByEmailRepository
  ) {}

  async add (user: UserModel): Promise<User | EmailInUseError> {
    await this.findUserByEmailRepository.findByEmail(user.email)

    const hasherPassword = await this.hasher.hash(user.password ?? '')
    return await this.addUserRepository.add({
      ...user,
      password: hasherPassword
    })
  }
}
