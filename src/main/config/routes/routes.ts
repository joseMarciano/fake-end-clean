import { Express, Router } from 'express'
import { mapAuthRouters, mapFakeRouters, mapFreeRouters } from './routerHelper'

export const setRoutes = (app: Express): void => {
  const router = Router()

  router
    .use(mapFreeRouters())
    .use('/auth', mapAuthRouters())
    .use('/fake', mapFakeRouters())

  app
    .use(process.env.DEFAULT_PATH as string, router)
}
