import { Controller } from '../../../../presentation/protocols'
import { AuthController } from '../../../../presentation/controllers/authentication/AuthController'
import { makeAuthByToken } from '../../usecases/authentication/authByTokenFactory'
import { applicationContext } from '../../application/applicationContextFactory'

export const makeAuthControllerFactory = (): Controller => {
  const authByToken = makeAuthByToken()
  return new AuthController(authByToken, applicationContext)
}
