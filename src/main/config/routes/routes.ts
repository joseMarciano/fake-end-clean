import { Express, Router } from 'express'
import loginRoute from '../../routes/login/loginRoute'

export const setRoutes = (app: Express): void => {
  const router = Router()

  loginRoute(router)

  app
    .use(process.env.DEFAULT_PATH as string, router)
}
