import { DbPageFakeData } from '../../../../data/usecases/fakeData/page/DbPageFakeData'
import { PageFakeData } from '../../../../domain/usecases/fakeData/find/PageFakeData'
import { makeFakeDataMongoRepository } from '../../repositories/fakeDataMongoRepositoryFactory'

export const makeDbPageFakeData = (): PageFakeData => {
  const fakeDataRepository = makeFakeDataMongoRepository()
  return new DbPageFakeData(fakeDataRepository)
}
