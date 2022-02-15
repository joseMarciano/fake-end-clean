import { User } from '../../../../domain/model/User'
import { ActivateUserError } from '../validations/ActivateUserError'

export interface ActivateUser {
  active: (userActivateModel: ActivateUserModel) => Promise<User | ActivateUserError >
}

export interface ActivateUserModel {
  encryptedValue: string
}
