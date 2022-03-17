import { Router } from 'express'
import { makeLogOutController } from '../../../main/factories/controller/login/logOut/logOutControllerFactory'
import { makeLoginController } from '../../../main/factories/controller/login/login/loginControllerFactory'
import { controllerAdapter } from '../../adapters/controllers/controllerAdapter'
import { makeActiveSignUpController } from '../../factories/controller/login/active/activeSignUpControllerFactory'
import { makeSignUpController } from '../../factories/controller/login/signup/signUpControllerFactory'
import { makeUpdateAccessTokenController } from '../../../main/factories/controller/login/updateAccessToken/updateAccessTokenControllerFactory'

export const loginFreeRoute = Router()
  .post('/signup', controllerAdapter(makeSignUpController()))
  .get('/active', controllerAdapter(makeActiveSignUpController()))
  .post('/login', controllerAdapter(makeLoginController()))
  .put('/access-token', controllerAdapter(makeUpdateAccessTokenController()))

export const loginAuthRoute = Router()
  .post('/', controllerAdapter(makeLogOutController()))
