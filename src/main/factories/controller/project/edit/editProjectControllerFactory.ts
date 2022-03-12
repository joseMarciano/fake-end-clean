import { Controller } from '../../../../../presentation/protocols'
import { makeValidationComposite } from './editProjectValidationCompositeFactory'
import { EditProjectController } from '../../../../../presentation/controllers/project/editById/EditProjectController'
import { makeDbEditProject } from '../../../../../main/factories/usecases/project/dbEditProject'

export const makeEditProjectController = (): Controller => {
  const dbEditProject = makeDbEditProject()
  const validationComposite = makeValidationComposite()
  return new EditProjectController(
    dbEditProject,
    validationComposite
  )
}
