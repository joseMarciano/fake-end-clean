import { Express, Router } from 'express'
import projectRoute from '../../../main/routes/project/projectRoute'
import loginRoute from '../../routes/login/loginRoute'

export const setRoutes = (app: Express): void => {
  const router = Router()

  loginRoute(router)
  projectRoute(router)

  app
    .use(process.env.DEFAULT_PATH as string, router)
}
