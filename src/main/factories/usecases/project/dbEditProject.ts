import { DbEditProject } from '../../../../data/usecases/project/edit/DbEditProject'
import { EditProject } from '../../../../domain/usecases/project/edit/EditProject'
import { makeProjectMongoRepository } from '../../repositories/projectMongoRepositoryFactory'

export const makeDbEditProject = (): EditProject => {
  const projectRepository = makeProjectMongoRepository()
  return new DbEditProject(projectRepository)
}
