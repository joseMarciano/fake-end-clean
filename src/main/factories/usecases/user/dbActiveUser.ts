import { DbActiveUser } from '../../../../data/usecases/user/activate/DbActiveUser'
import { makeJwtAdapter } from '../../cryptography/jwtAdapterFactory'
import { makeUserMongoRepository } from '../../repositories/userMongoRepositoryFactory'

export const makeDbActiveUser = (): DbActiveUser => {
  const decrypter = makeJwtAdapter()
  const userMongoRepository = makeUserMongoRepository()
  return new DbActiveUser(
    decrypter,
    userMongoRepository,
    userMongoRepository,
    userMongoRepository
  )
}
