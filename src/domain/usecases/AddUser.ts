import { User } from '../model/User'

export interface AddUser {
  add: (user: UserModel) => Promise<User>
}

export interface UserModel {
  email: string
  name: string
  isActive: boolean
  password?: string
}
