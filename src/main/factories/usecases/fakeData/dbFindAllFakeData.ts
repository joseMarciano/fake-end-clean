import { DbFindAllFakeData } from '../../../../data/usecases/fakeData/findAll/DbFindAllFakeData'
import { FindAllFakeData } from '../../../../domain/usecases/fakeData/find/FindAllFakeData'
import { makeFakeDataMongoRepository } from '../../repositories/fakeDataMongoRepositoryFactory'

export const makeDbFindAllFakeData = (): FindAllFakeData => {
  const fakeDataRepository = makeFakeDataMongoRepository()
  return new DbFindAllFakeData(fakeDataRepository)
}
