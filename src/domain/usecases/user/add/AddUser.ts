import { User } from '../../../model/User'
import { EmailInUseError } from '../validations/EmailInUseError'

export interface AddUser {
  add: (user: UserModel) => Promise<User | EmailInUseError>
}

export interface UserModel {
  email: string
  name: string
  isActive: boolean
  password?: string
}
