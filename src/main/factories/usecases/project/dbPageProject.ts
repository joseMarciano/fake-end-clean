import { DbPageProject } from '../../../../data/usecases/project/page/DbPageProject'
import { PageProject } from '../../../../domain/usecases/project/find/PageProject'
import { makeProjectMongoRepository } from '../../repositories/projectMongoRepositoryFactory'

export const makeDbPageProject = (): PageProject => {
  const projectRepository = makeProjectMongoRepository()
  return new DbPageProject(projectRepository)
}
