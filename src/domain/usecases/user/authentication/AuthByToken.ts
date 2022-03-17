import { User } from '../../../../domain/model/User'
import { AuthByTokenError } from '../validations/AuthByTokenError'

export interface AuthByToken {
  authByToken: (token: string) => Promise<User | AuthByTokenError>
}
