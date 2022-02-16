import { makeDbActiveUser } from '../../../../../main/factories/usecases/user/dbActiveUser'
import { ActiveUserController } from '../../../../../presentation/controllers/login/active/ActiveUserController'
import { makeActiveUserValidator } from './activeSignUpControllerValidatorFactory'

export const makeActiveSignUpController = (): ActiveUserController => {
  const activateUser = makeDbActiveUser()
  const validator = makeActiveUserValidator()
  return new ActiveUserController(activateUser, validator)
}
