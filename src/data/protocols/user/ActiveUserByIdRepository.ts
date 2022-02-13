import { User } from '../../../domain/model/User'

export interface ActiveUserByIdRepository {
  activeById: (id: string) => Promise<User>
}
