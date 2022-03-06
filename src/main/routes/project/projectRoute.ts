import { Router } from 'express'
import { makeAddProjectController } from '../../../main/factories/controller/project/add/addProjectControllerFactory'
import { controllerAdapter } from '../../../main/adapters/controllers/controllerAdapter'
import { makeFindProjectByIdController } from '../../../main/factories/controller/project/findById/findProjectByIdControllerFactory'

export default Router()
  .post('/', controllerAdapter(makeAddProjectController()))
  .get('/:id', controllerAdapter(makeFindProjectByIdController()))
