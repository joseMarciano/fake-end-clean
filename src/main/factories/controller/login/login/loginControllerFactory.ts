import { makeLoginUser } from '../../../../../main/factories/usecases/user/dbLoginUser'
import { LoginController } from '../../../../../presentation/controllers/login/login/LoginController'
import { makeValidationComposite } from './loginValidationCompositeFactory'

export const makeLoginController = (): LoginController => {
  const validatonComposite = makeValidationComposite()
  const dbLoginUser = makeLoginUser()
  return new LoginController(dbLoginUser, validatonComposite)
}
