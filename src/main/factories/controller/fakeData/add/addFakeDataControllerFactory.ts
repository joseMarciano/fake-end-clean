import { makeDbAddFakeData } from 'src/main/factories/usecases/fakeData/dbAddFakeData'
import { AddFakeDataController } from 'src/presentation/controllers/fakeData/add/AddFakeDataController'
import { Controller } from '../../../../../presentation/protocols'

export const makeFakeDataController = (): Controller => {
  const addFakeData = makeDbAddFakeData()
  return new AddFakeDataController(addFakeData)
}
