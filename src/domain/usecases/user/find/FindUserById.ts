import { User } from '../../../../domain/model/User'

export interface FindUserById {
  findById: (id: string) => Promise<User>
}
