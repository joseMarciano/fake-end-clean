import { Router } from 'express'
import { makeAddProjectController } from '../../../main/factories/controller/project/add/addProjectControllerFactory'
import { controllerAdapter } from '../../../main/adapters/controllers/controllerAdapter'
import { makeFindProjectByIdController } from '../../../main/factories/controller/project/findById/findProjectByIdControllerFactory'
import { makePageProjectController } from '../../../main/factories/controller/project/page/pageProjectControllerFactory'
import { makeDeleteProjectByIdController } from '../../../main/factories/controller/project/remove/deleteProjectByIdControllerFactory'

export default Router()
  .post('/', controllerAdapter(makeAddProjectController()))
  .get('/', controllerAdapter(makePageProjectController()))
  .get('/:id', controllerAdapter(makeFindProjectByIdController()))
  .delete('/:id', controllerAdapter(makeDeleteProjectByIdController()))
