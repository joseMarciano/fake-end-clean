import { makeDbFindAllFakeData } from '../../../../../main/factories/usecases/fakeData/dbFindAllFakeData'
import { FindAllFakeDataController } from '../../../../../presentation/controllers/fakeData/findAll/FindAllFakeDataController'
import { Controller } from '../../../../../presentation/protocols'

export const makeFindAllFakeDataController = (): Controller => {
  const dbFindAllFakeData = makeDbFindAllFakeData()
  return new FindAllFakeDataController(dbFindAllFakeData)
}
