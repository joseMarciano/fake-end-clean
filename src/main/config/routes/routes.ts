import { Express, Router } from 'express'
import signUpRoute from '../../routes/login/loginRoute'

export const setRoutes = (app: Express): void => {
  const router = Router()

  signUpRoute(router)

  app
    .use(process.env.DEFAULT_PATH as string, router)
}
