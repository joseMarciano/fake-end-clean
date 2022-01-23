import { Express, json } from 'express'
import cors from 'cors'

export const setMiddlewares = (app: Express): void => {
  app
    .use(cors())
    .use(json())
}
