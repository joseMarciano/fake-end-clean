import { Router } from 'express'
import { controllerAdapter } from '../adapters/controllers/controllerAdapter'
import { makeSignUpController } from '../factories/controller/login/signup/signUpControllerFactory'

export default (router: Router): void => {
  router.post('/signup', controllerAdapter(makeSignUpController()))
}
