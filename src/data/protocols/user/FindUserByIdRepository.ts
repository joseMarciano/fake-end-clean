import { User } from 'src/domain/model/User'

export interface FindUserByIdRepository {
  findById: (id: string) => Promise<User>
}
