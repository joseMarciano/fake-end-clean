import { EmailNotification } from '../../../../infra/notification/EmailNotification'
import { SignUpController } from '../../../../presentation/controllers/login/signUp/SignUpController'
import { makeValidationComposite } from './signUpValidationCompositeFactory'
import { makeDbAuthentication } from '../../usecases/user/dbAuthenticationFactory'
import { makeDbAddUser } from '../../usecases/user/dbAddUserFactory'

export const makeSignUpController = (): SignUpController => {
  const dbAuthentication = makeDbAuthentication()
  const addUser = makeDbAddUser()
  const validatonComposite = makeValidationComposite()
  const emailNotification = new EmailNotification()
  return new SignUpController(addUser, validatonComposite, emailNotification, dbAuthentication)
}
