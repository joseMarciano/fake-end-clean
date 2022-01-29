import express from 'express'
import { setMiddlewares } from './middlewares/middlewares'
import { setRoutes } from './routes/routes'

const app = express()
setMiddlewares(app)
setRoutes(app)
export { app }
