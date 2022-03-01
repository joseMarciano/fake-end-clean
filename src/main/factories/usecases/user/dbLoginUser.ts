import { DbLoginUser } from '../../../../data/usecases/user/authentication/DbLoginUser'
import { makeBcryptAdapter } from '../../cryptography/bcryptAdapterFactory'
import { makeJwtAdapter } from '../../cryptography/jwtAdapterFactory'
import { makeUUIDAdapter } from '../../cryptography/uuidAdapterFactory'
import { makeUserMongoRepository } from '../../repositories/userMongoRepositoryFactory'

export const makeLoginUser = (): DbLoginUser => {
  const userRepository = makeUserMongoRepository()
  const bCryptAdapter = makeBcryptAdapter()
  const uuidApdater = makeUUIDAdapter()
  const jwtAdapter = makeJwtAdapter()

  return new DbLoginUser(
    userRepository,
    bCryptAdapter,
    uuidApdater,
    userRepository,
    jwtAdapter,
    userRepository
  )
}
