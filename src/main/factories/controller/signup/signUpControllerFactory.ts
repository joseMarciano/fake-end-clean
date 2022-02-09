import { EmailNotification } from '../../../../infra/notification/EmailNotification'
import { DbAddUser } from '../../../../data/usecases/user/DbAddUser'
import { UserMongoRespository } from '../../../../infra/user/UserMongoRepository'
import { SignUpController } from '../../../../presentation/controllers/signUp/SignUpController'
import { makeBcryptAdapter } from '../../cryptography/bcryptAdapterFactory'
import { makeValidationComposite } from './signUpValidationCompositeFactory'

export const makeSignUpController = (): SignUpController => {
  const emailNotification = new EmailNotification()
  const userMongoRepository = new UserMongoRespository()
  const addUser = new DbAddUser(userMongoRepository, makeBcryptAdapter(), userMongoRepository)
  return new SignUpController(addUser, makeValidationComposite(), emailNotification)
}
