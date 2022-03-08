import { Controller } from '../../../../../presentation/protocols'
import { makeDbPageProject } from '../../../../../main/factories/usecases/project/dbPageProject'
import { PageProjectController } from '../../../../../presentation/controllers/project/page/PageProjectController'

export const makePageProjectController = (): Controller => {
  const dbPageProject = makeDbPageProject()
  return new PageProjectController(dbPageProject)
}
