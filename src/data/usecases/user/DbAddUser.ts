import { Hasher } from '../../../data/protocols/cryptography/Hasher'
import { AddUserRepository } from '../../../data/protocols/AddUserRepository'
import { User } from '../../../domain/model/User'
import { AddUser, UserModel } from '../../../domain/usecases/AddUser'

export class DbAddUser implements AddUser {
  constructor (
    private readonly addUserRepository: AddUserRepository,
    private readonly hasher: Hasher
  ) {}

  async add (user: UserModel): Promise<User> {
    await this.hasher.hash(user.password ?? '')
    return await this.addUserRepository.add(user)
  }
}
