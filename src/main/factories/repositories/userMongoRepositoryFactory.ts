import { UserMongoRespository } from '../../../infra/user/UserMongoRepository'

export const makeUserMongoRepository = (): UserMongoRespository => {
  return new UserMongoRespository()
}
