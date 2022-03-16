import { DbFindFakeDataById } from '../../../../data/usecases/fakeData/findById/DbFindFakeDataById'
import { FindFakeDataById } from '../../../../domain/usecases/fakeData/find/FindFakeDataById'
import { makeFakeDataMongoRepository } from '../../repositories/fakeDataMongoRepositoryFactory'

export const makeDbFindFakeDataById = (): FindFakeDataById => {
  const fakeDataRepository = makeFakeDataMongoRepository()
  return new DbFindFakeDataById(fakeDataRepository)
}
