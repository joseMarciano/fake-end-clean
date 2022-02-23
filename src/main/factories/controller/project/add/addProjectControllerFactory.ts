import { makeDbAddProject } from '../../../../../main/factories/usecases/project/dbAddProject'
import { AddProjectController } from '../../../../../presentation/controllers/project/add/AddProjectController'
import { Controller } from '../../../../../presentation/protocols'
import { makeValidationComposite } from './addProjectValidationCompositeFactory'

export const makeAddProjectController = (): Controller => {
  const addProject = makeDbAddProject()
  const validationComposite = makeValidationComposite()
  return new AddProjectController(addProject, validationComposite)
}
