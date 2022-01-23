import { AddUserRepository } from 'src/data/protocols/AddUserRepository'
import { User } from 'src/domain/model/User'
import { AddUser, UserModel } from 'src/domain/usecases/AddUser'

export class DbAddUser implements AddUser {
  constructor (
    private readonly addUserRepository: AddUserRepository
  ) {}

  async add (user: UserModel): Promise<User> {
    await this.addUserRepository.add(user)

    return await Promise.resolve({
      email: 'any',
      id: 'any',
      name: 'any',
      password: 'any'
    })
  }
}
