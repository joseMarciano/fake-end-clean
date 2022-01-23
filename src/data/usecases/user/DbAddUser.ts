import { AddUserRepository } from '../../../data/protocols/AddUserRepository'
import { User } from '../../../domain/model/User'
import { AddUser, UserModel } from '../../../domain/usecases/AddUser'

export class DbAddUser implements AddUser {
  constructor (
    private readonly addUserRepository: AddUserRepository
  ) {}

  async add (user: UserModel): Promise<User> {
    return await this.addUserRepository.add(user)
  }
}
