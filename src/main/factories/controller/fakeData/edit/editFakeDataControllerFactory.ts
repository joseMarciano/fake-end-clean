import { makeEditFakeDataById } from '../../../../../main/factories/usecases/fakeData/dbEditFakeDataById'
import { EditFakeDataController } from '../../../../../presentation/controllers/fakeData/editById/EditFakeDataByIdController'
import { Controller } from '../../../../../presentation/protocols'

export const makeEditFakeDataController = (): Controller => {
  const makeDbEditFakeDataById = makeEditFakeDataById()
  return new EditFakeDataController(makeDbEditFakeDataById)
}
