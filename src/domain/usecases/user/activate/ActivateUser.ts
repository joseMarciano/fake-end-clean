import { User } from '../../../../domain/model/User'

export interface ActivateUser {
  active: (user: User) => Promise<void>
}
