import { makeDbPageFakeData } from '../../../../../main/factories/usecases/fakeData/dbPageFakeData'
import { PageFakeDataController } from '../../../../../presentation/controllers/fakeData/page/PageFakeDataController'
import { Controller } from '../../../../../presentation/protocols'

export const makePageFakeDataController = (): Controller => {
  const dbPageFakeData = makeDbPageFakeData()
  return new PageFakeDataController(dbPageFakeData)
}
