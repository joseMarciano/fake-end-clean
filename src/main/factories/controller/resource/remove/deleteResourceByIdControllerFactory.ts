import { makeDbDeleteResourceById } from '../../../../../main/factories/usecases/resource/dbDeleteResource'
import { DeleteResourceByIdController } from '../../../../../presentation/controllers/resource/remove/DeleteResourceByIdController'
import { Controller } from '../../../../../presentation/protocols'
import { makeValidationComposite } from './deleteResourceByIdValidationCompositeFactory'

export const makeDeleteResourceByIdController = (): Controller => {
  const dbFindProjectById = makeDbDeleteResourceById()
  const validationComposite = makeValidationComposite()
  return new DeleteResourceByIdController(
    dbFindProjectById,
    validationComposite
  )
}
