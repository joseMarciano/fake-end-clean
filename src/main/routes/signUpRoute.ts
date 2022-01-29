import { Router } from 'express'
import { controllerAdapter } from '../adapters/controllers/controllerAdapter'
import { makeSignUpController } from '../factories/controller/signUpControllerFactory'

export default (router: Router): void => {
  router.post('/signup', controllerAdapter(makeSignUpController()))
}
