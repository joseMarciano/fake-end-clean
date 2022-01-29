import { Router } from 'express'
import { SignUpController } from '../../presentation/controllers/signUp/SignUpController'
import { DbAddUser } from '../../data/usecases/user/DbAddUser'
import { UserMongoRespository } from '../../infra/user/UserMongoRepository'
import { controllerAdapter } from '../adapters/controllers/controllerAdapter'

const makeSignUpController = (): SignUpController => {
  const userMongoRepository = new UserMongoRespository()
  const addUser = new DbAddUser(userMongoRepository)
  return new SignUpController(addUser)
}

export default (router: Router): void => {
  router.post('/signup', controllerAdapter(makeSignUpController()))
}
