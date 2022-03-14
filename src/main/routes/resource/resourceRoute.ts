import { Router } from 'express'
import { makeAddResourceController } from '../../../main/factories/controller/resource/add/addResourceControllerFactory'
import { controllerAdapter } from '../../adapters/controllers/controllerAdapter'

export default Router()
  .post('/:projectId', controllerAdapter(makeAddResourceController()))
