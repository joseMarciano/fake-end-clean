import express from 'express'
import { setMiddlewares } from './middlewares/middlewares'

const app = express()
setMiddlewares(app)
export { app }
