import { Router } from 'express'
import { controllerAdapter } from '../../adapters/controllers/controllerAdapter'
import { makeActiveSignUpController } from '../../factories/controller/login/active/activeSignUpControllerFactory'
import { makeSignUpController } from '../../factories/controller/login/signup/signUpControllerFactory'

export default Router()
  .post('/signup', controllerAdapter(makeSignUpController()))
  .get('/active', controllerAdapter(makeActiveSignUpController()))
