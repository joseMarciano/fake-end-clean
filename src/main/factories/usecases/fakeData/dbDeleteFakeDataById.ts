import { DbDeleteFakeDataById } from '../../../../data/usecases/fakeData/remove/DbDeleteFakeDataById'
import { DeleteFakeDataById } from '../../../../domain/usecases/fakeData/remove/DeleteFakeDataById'
import { makeFakeDataMongoRepository } from '../../repositories/fakeDataMongoRepositoryFactory'

export const makeDbDeleteFakeDateById = (): DeleteFakeDataById => {
  const fakeDataRepository = makeFakeDataMongoRepository()
  return new DbDeleteFakeDataById(fakeDataRepository)
}
