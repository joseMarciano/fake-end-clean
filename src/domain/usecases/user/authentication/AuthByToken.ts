import { User } from '../../../../domain/model/User'

export interface AuthByToken {
  authByToken: (token: string) => Promise<User | null>
}
