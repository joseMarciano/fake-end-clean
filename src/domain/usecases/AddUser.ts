import { User } from '../model/User'

export interface AddUser {
  addUser: (user: UserModel) => Promise<User>
}

interface UserModel {
  email: string
  name: string
  password?: string
  passwordConfirmation?: string
}
