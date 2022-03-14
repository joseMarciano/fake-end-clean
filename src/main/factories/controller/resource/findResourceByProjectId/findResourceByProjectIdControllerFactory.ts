import { Controller } from '../../../../../presentation/protocols'
import { FindResourcesByProjectIdController } from '../../../../../presentation/controllers/resource/findResourceByProjectId/FindResourcesByProjectIdController'
import { makeValidationComposite } from './findResourceByProjectIdValidationCompositeFactory'
import { makeDbFindResourceByProjectId } from '../../../../../main/factories/usecases/resource/dbFindResourceByProjectId'

export const makeFindResourceByProjectIdController = (): Controller => {
  const findResourceByProjectId = makeDbFindResourceByProjectId()
  const validationComposite = makeValidationComposite()
  return new FindResourcesByProjectIdController(findResourceByProjectId, validationComposite)
}
