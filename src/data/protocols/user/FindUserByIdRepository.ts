import { User } from '../../../domain/model/User'

export interface FindUserByIdRepository {
  findById: (id: string) => Promise<User>
}
