import { User } from '../../../domain/model/User'

export interface UserContext {
  setUser: (user: User) => Promise<void>
  getUser: () => Promise<User>
}
