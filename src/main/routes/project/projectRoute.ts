import { Router } from 'express'
import { makeAddProjectController } from '../../../main/factories/controller/project/add/addProjectControllerFactory'
import { controllerAdapter } from '../../../main/adapters/controllers/controllerAdapter'

export default Router()
  .post('/', controllerAdapter(makeAddProjectController()))