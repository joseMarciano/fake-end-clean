import { applicationContext } from '../../../../../main/factories/application/applicationContextFactory'
import { fakeApplicationContext } from '../../../../../main/factories/application/fakeApplicationContextFactory'
import { makeJwtAdapter } from '../../../../../main/factories/cryptography/jwtAdapterFactory'
import { makeProjectMongoRepository } from '../../../../../main/factories/repositories/projectMongoRepositoryFactory'
import { makeResourceMongoRepository } from '../../../../../main/factories/repositories/resourceMongoRepositoryFactory'
import { makeUserMongoRepository } from '../../../../../main/factories/repositories/userMongoRepositoryFactory'
import { FakeDataAuthController } from '../../../../../presentation/controllers/authentication/fakeData/FakeDataAuthController'
import { Controller } from '../../../../../presentation/protocols'

export const makeFakeAuthController = (): Controller => {
  const decrypter = makeJwtAdapter()
  const projectRepository = makeProjectMongoRepository()
  const userRepository = makeUserMongoRepository()
  const resourceRepository = makeResourceMongoRepository()

  return new FakeDataAuthController(
    applicationContext,
    fakeApplicationContext,
    decrypter,
    projectRepository,
    userRepository,
    resourceRepository
  )
}
