import { User } from '../../../domain/model/User'

export interface GetUserContext {
  getUser: () => Promise<User>
}

export interface SetUserContext {
  setUser: (user: User) => Promise<void>
}
