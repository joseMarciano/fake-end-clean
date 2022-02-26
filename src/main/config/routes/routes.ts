import { Express, Router } from 'express'
import { mapAuthRouters, mapFreeRouters } from './routerHelper'

export const setRoutes = (app: Express): void => {
  const router = Router()

  router
    .use(mapFreeRouters())
    .use('/auth', mapAuthRouters())

  app
    .use(process.env.DEFAULT_PATH as string, router)
}
