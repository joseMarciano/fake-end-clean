import { makeDbLogOutUser } from '../../../../../main/factories/usecases/user/dbLogOutUser'
import { LogOutController } from '../../../../../presentation/controllers/login/logout/LogOutController'
import { Controller } from '../../../../../presentation/protocols'

export const makeLogOutController = (): Controller => {
  const dbLogOutUser = makeDbLogOutUser()
  return new LogOutController(dbLogOutUser)
}
