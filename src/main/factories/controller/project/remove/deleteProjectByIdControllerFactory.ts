import { Controller } from '../../../../../presentation/protocols'
import { makeValidationComposite } from './deleteProjectByIdValidationCompositeFactory'
import { DeleteProjectByIdController } from '../../../../../presentation/controllers/project/remove/DeleteProjectByIdController'
import { makeDbDeleteProjectById } from '../../../../../main/factories/usecases/project/dbDeleteProjectById'

export const makeDeleteProjectByIdController = (): Controller => {
  const dbFindProjectById = makeDbDeleteProjectById()
  const validationComposite = makeValidationComposite()
  return new DeleteProjectByIdController(
    dbFindProjectById,
    validationComposite
  )
}
