import { DbUpdateUserAccessToken } from '../../../../data/usecases/user/authentication/DbUpdateUserAccessToken'
import { UpdateUserAccessToken } from '../../../../domain/usecases/user/authentication/UpdateUserAccessToken'
import { makeJwtAdapter } from '../../cryptography/jwtAdapterFactory'
import { makeUserMongoRepository } from '../../repositories/userMongoRepositoryFactory'

export const makeDbUpdateUserAccessToken = (): UpdateUserAccessToken => {
  const userRepository = makeUserMongoRepository()
  const encrypter = makeJwtAdapter()
  return new DbUpdateUserAccessToken(
    userRepository,
    userRepository,
    encrypter,
    userRepository
  )
}
