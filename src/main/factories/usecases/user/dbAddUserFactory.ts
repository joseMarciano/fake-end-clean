import { DbAddUser } from '../../../../data/usecases/user/add/DbAddUser'
import { makeBcryptAdapter } from '../../cryptography/bcryptAdapterFactory'
import { makeUserMongoRepository } from '../../repositories/userMongoRepositoryFactory'

export const makeDbAddUser = (): DbAddUser => {
  const userMongoRepository = makeUserMongoRepository()
  const bcryptAdapter = makeBcryptAdapter()

  return new DbAddUser(
    userMongoRepository,
    bcryptAdapter,
    userMongoRepository
  )
}
