import { User } from 'src/domain/model/User'
import { UserModel } from 'src/domain/usecases/AddUser'

export interface AddUserRepository {
  add: (userModel: UserModel) => Promise<User>
}
