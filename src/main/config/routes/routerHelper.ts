import { Router } from 'express'
import { makeFakeAuthController } from '../../../main/factories/controller/authentication/fakeData/fakeAuthControllerFactory'
import { middlewaresAdapter } from '../../../main/adapters/express/middlewaresAdapter'
import { makeAuthControllerFactory } from '../../../main/factories/controller/authentication/authControllerFacotory'
import { loginFreeRoute, loginAuthRoute } from '../../../main/routes/login/loginRoute'
import projectRoute from '../../../main/routes/project/projectRoute'
import fakeDataRoute from '../../routes/fakeData/fakeDataRoute'
import resourceRoute from '../../../main/routes/resource/resourceRoute'

export const mapFreeRouters = (): Router => {
  return Router()
    .use('', loginFreeRoute)
}

export const mapAuthRouters = (): Router => {
  return Router()
    .all('*', middlewaresAdapter(makeAuthControllerFactory()))
    .use('/project', projectRoute)
    .use('/resource', resourceRoute)
    .use('/logout', loginAuthRoute)
}

export const mapFakeRouters = (): Router => {
  return Router()
    .all('*', middlewaresAdapter(makeFakeAuthController()), fakeDataRoute)
}
