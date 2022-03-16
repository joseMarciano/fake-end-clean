import { makeDbFindFakeDataById } from '../../../../../main/factories/usecases/fakeData/dbFindFakeDataById'
import { FindFakeDataByIdController } from '../../../../../presentation/controllers/fakeData/findById/FindFakeDataByIdController'
import { Controller } from '../../../../../presentation/protocols'

export const makeFindFakeDataByIdController = (): Controller => {
  const dbFindFakeDataById = makeDbFindFakeDataById()
  return new FindFakeDataByIdController(dbFindFakeDataById)
}
