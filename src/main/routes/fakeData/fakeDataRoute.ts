import { Router } from 'express'
import { controllerAdapter } from '../../adapters/controllers/controllerAdapter'
import { makeAddFakeDataController } from '../../factories/controller/fakeData/add/addFakeDataControllerFactory'

export default Router()
  .post(/^.+\/create$/, controllerAdapter(makeAddFakeDataController()))
