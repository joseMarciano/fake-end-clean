import { FakeDataMongoRepository } from '../../../infra/fakeData/FakeDataMongoRepository'
import { fakeApplicationContext } from '../application/fakeApplicationContextFactory'

export const makeFakeDataMongoRepository = (): FakeDataMongoRepository => {
  return new FakeDataMongoRepository(fakeApplicationContext)
}
