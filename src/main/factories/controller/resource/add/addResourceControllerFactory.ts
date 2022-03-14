import { Controller } from '../../../../../presentation/protocols'
import { makeValidationComposite } from './addResourceValidationCompositeFactory'
import { makeDbAddResource } from '../../../../../main/factories/usecases/resource/dbAddResource'
import { AddResourceController } from '../../../../../presentation/controllers/resource/add/AddResourceController'

export const makeAddResourceController = (): Controller => {
  const addResource = makeDbAddResource()
  const validationComposite = makeValidationComposite()
  return new AddResourceController(addResource, validationComposite)
}
