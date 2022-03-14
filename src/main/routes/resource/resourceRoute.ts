import { Router } from 'express'
import { makeFindResourceByProjectIdController } from '../../../main/factories/controller/resource/findResourceByProjectId/findResourceByProjectIdControllerFactory'
import { makeAddResourceController } from '../../../main/factories/controller/resource/add/addResourceControllerFactory'
import { controllerAdapter } from '../../adapters/controllers/controllerAdapter'

export default Router()
  .post('/:projectId', controllerAdapter(makeAddResourceController()))
  .get('/:projectId', controllerAdapter(makeFindResourceByProjectIdController()))
