import { Router } from 'express'
import { makeLoginController } from '../../../main/factories/controller/login/login/loginControllerFactory'
import { controllerAdapter } from '../../adapters/controllers/controllerAdapter'
import { makeActiveSignUpController } from '../../factories/controller/login/active/activeSignUpControllerFactory'
import { makeSignUpController } from '../../factories/controller/login/signup/signUpControllerFactory'

export default Router()
  .post('/signup', controllerAdapter(makeSignUpController()))
  .get('/active', controllerAdapter(makeActiveSignUpController()))
  .post('/login', controllerAdapter(makeLoginController()))
