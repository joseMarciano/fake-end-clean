import { Router } from 'express'
import { middlewaresAdapter } from '../../../main/adapters/express/middlewaresAdapter'
import { makeAuthControllerFactory } from '../../../main/factories/controller/authentication/authControllerFacotory'
import loginRoute from '../../../main/routes/login/loginRoute'
import projectRoute from '../../../main/routes/project/projectRoute'
import resourceRoute from '../../../main/routes/resource/resourceRoute'

export const mapFreeRouters = (): Router => {
  return Router()
    .use('', loginRoute)
}

export const mapAuthRouters = (): Router => {
  return Router()
    .all('*', middlewaresAdapter(makeAuthControllerFactory()))
    .use('/project', projectRoute)
    .use('/resource', resourceRoute)
}
