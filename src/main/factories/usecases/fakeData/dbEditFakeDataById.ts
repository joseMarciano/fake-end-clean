import { DbEditFakeData } from '../../../../data/usecases/fakeData/edit/DbEditFakeData'
import { EditFakeData } from '../../../../domain/usecases/fakeData/edit/EditFakeData'
import { makeFakeDataMongoRepository } from '../../repositories/fakeDataMongoRepositoryFactory'

export const makeEditFakeDataById = (): EditFakeData => {
  const fakeDataRepository = makeFakeDataMongoRepository()
  return new DbEditFakeData(fakeDataRepository)
}
