import { User } from '../../domain/model/User'

export interface FindUserByEmailRepository {
  findByEmail: (email: string) => Promise<User>
}
