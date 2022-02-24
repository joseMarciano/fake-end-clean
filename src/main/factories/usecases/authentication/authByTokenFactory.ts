import { DbAuthByToken } from '../../../../data/usecases/user/authentication/DbAuthByToken'
import { AuthByToken } from '../../../../domain/usecases/user/authentication/AuthByToken'
import { makeJwtAdapter } from '../../cryptography/jwtAdapterFactory'
import { makeUserMongoRepository } from '../../repositories/userMongoRepositoryFactory'

export const makeAuthByToken = (): AuthByToken => {
  const decrypter = makeJwtAdapter()
  const userRepository = makeUserMongoRepository()

  return new DbAuthByToken(
    decrypter,
    userRepository,
    userRepository
  )
}
