import { makeDbDeleteFakeDateById } from '../../../../../main/factories/usecases/fakeData/dbDeleteFakeDataById'
import { DeleteFakeDataByIdController } from '../../../../../presentation/controllers/fakeData/remove/DeleteFakeDataByIdController'
import { Controller } from '../../../../../presentation/protocols'

export const makeDeleteFakeDataByIdController = (): Controller => {
  const dbDeleteFakeDataById = makeDbDeleteFakeDateById()
  return new DeleteFakeDataByIdController(dbDeleteFakeDataById)
}
