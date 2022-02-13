import { User } from '../../../../domain/model/User'

export interface ActivateUser {
  active: (userActivateModel: ActivateUserModel) => Promise<User>
}

export interface ActivateUserModel {
  encryptedValue: string
}
