import { Router } from 'express'
import { makeFindAllFakeDataController } from '../../../main/factories/controller/fakeData/findAll/findAllFakeDataControllerFactory'
import { makeEditFakeDataController } from '../../../main/factories/controller/fakeData/edit/editFakeDataControllerFactory'
import { controllerAdapter } from '../../adapters/controllers/controllerAdapter'
import { makeAddFakeDataController } from '../../factories/controller/fakeData/add/addFakeDataControllerFactory'
import { makePageFakeDataController } from '../../../main/factories/controller/fakeData/page/pageFakeDataControllerFactory'
import { makeFindFakeDataByIdController } from '../../../main/factories/controller/fakeData/findById/findFakeDataByIdControllerFactory'

export default Router()
  .post(/^.+\/create$/, controllerAdapter(makeAddFakeDataController()))
  .put(/^.+\/edit$/, controllerAdapter(makeEditFakeDataController()))
  .get(/^.+\/list-all$/, controllerAdapter(makeFindAllFakeDataController()))
  .get(/^.+\/page$/, controllerAdapter(makePageFakeDataController()))
  .get('*/find-by-id/:id', controllerAdapter(makeFindFakeDataByIdController()))
