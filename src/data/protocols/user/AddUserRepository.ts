import { User } from '../../../domain/model/User'
import { UserModel } from '../../../domain/usecases/user/add/AddUser'

export interface AddUserRepository {
  add: (userModel: UserModel) => Promise<User>
}
