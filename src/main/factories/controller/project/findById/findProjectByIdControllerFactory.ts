import { makeDbFindProjectById } from '../../../../../main/factories/usecases/project/dbFindProjectById'
import { FindProjectByIdController } from '../../../../../presentation/controllers/project/findById/FindProjectByIdController'
import { Controller } from '../../../../../presentation/protocols'
import { makeValidationComposite } from './findProjectByIdValidationCompositeFactory'

export const makeFindProjectByIdController = (): Controller => {
  const dbFindProjectById = makeDbFindProjectById()
  const validationComposite = makeValidationComposite()
  return new FindProjectByIdController(
    dbFindProjectById,
    validationComposite
  )
}
