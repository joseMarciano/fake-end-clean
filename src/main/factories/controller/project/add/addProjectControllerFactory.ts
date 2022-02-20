import { makeDbAddProject } from '../../../../../main/factories/usecases/project/dbAddProject'
import { AddProjectController } from '../../../../../presentation/controllers/project/add/AddProjectController'
import { Controller, Validator } from '../../../../../presentation/protocols'

export const makeAddProjectController = (): Controller => {
  class Stub implements Validator {
    validate (input: any): Error | null {
      return null
    }
  }
  const addProject = makeDbAddProject()
  return new AddProjectController(addProject, new Stub())
}
