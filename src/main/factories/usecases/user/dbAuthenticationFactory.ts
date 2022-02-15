import { DbAuthentication } from '../../../../data/usecases/user/authentication/DbAuthentication'
import { makeBcryptAdapter } from '../../cryptography/bcryptAdapterFactory'
import { makeJwtAdapter } from '../../cryptography/jwtAdapterFactory'
import { makeUserMongoRepository } from '../../repositories/userMongoRepositoryFactory'

export const makeDbAuthentication = (): DbAuthentication => {
  const jwtAdapter = makeJwtAdapter()
  const userRepository = makeUserMongoRepository()
  const bcryptAdapter = makeBcryptAdapter()
  return new DbAuthentication(
    jwtAdapter,
    userRepository,
    bcryptAdapter,
    userRepository
  )
}
