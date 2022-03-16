import { DbAddFakeDataa } from '../../../../data/usecases/fakeData/add/DbAddFakeData'
import { AddFakeData } from '../../../../domain/usecases/fakeData/add/AddFakeData'
import { makeFakeDataMongoRepository } from '../../repositories/fakeDataMongoRepositoryFactory'

export const makeDbAddFakeData = (): AddFakeData => {
  const fakeDataRepository = makeFakeDataMongoRepository()
  return new DbAddFakeDataa(fakeDataRepository)
}
