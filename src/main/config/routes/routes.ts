import { Express, Router } from 'express'
import signUpRoute from '../../routes/signUpRoute'
import env from '../env'

export const setRoutes = (app: Express): void => {
  const router = Router()

  signUpRoute(router)

  app
    .use(env.defaultPath, router)
}
