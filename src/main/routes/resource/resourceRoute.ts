import { Router } from 'express'
import { makeFindResourceByProjectIdController } from '../../../main/factories/controller/resource/findResourceByProjectId/findResourceByProjectIdControllerFactory'
import { makeAddResourceController } from '../../../main/factories/controller/resource/add/addResourceControllerFactory'
import { controllerAdapter } from '../../adapters/controllers/controllerAdapter'
import { makeDeleteResourceByIdController } from '../../../main/factories/controller/resource/remove/deleteResourceByIdControllerFactory'

export default Router()
  .post('/:projectId', controllerAdapter(makeAddResourceController()))
  .get('/:projectId', controllerAdapter(makeFindResourceByProjectIdController()))
  .delete('/:id', controllerAdapter(makeDeleteResourceByIdController()))
