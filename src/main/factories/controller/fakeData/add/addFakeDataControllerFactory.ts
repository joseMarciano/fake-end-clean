import { makeDbAddFakeData } from 'src/main/factories/usecases/fakeData/dbAddFakeData'
import { AddFakeDataController } from 'src/presentation/controllers/fakeData/add/AddFakeDataController'
import { Controller } from '../../../../../presentation/protocols'

export const makeAddFakeDataController = (): Controller => {
  const addFakeData = makeDbAddFakeData()
  return new AddFakeDataController(addFakeData)
}
