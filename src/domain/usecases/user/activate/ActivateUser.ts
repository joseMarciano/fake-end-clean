import { User } from '../../../../domain/model/User'

export interface ActivateUser {
  active: (userModel: ActivateUserModel) => Promise<User>
}

export interface ActivateUserModel {
  email: string
  password: string
}
