import { DbLogOutUser } from '../../../../data/usecases/user/authentication/DbLogOutUser'
import { LogOutUser } from '../../../../domain/usecases/user/authentication/LogOutUser'
import { makeJwtAdapter } from '../../cryptography/jwtAdapterFactory'
import { makeUserMongoRepository } from '../../repositories/userMongoRepositoryFactory'

export const makeDbLogOutUser = (): LogOutUser => {
  const jwtDecrypter = makeJwtAdapter()
  const userRepository = makeUserMongoRepository()
  return new DbLogOutUser(
    jwtDecrypter,
    userRepository,
    userRepository
  )
}
