import { DbDeleteProjectById } from '../../../../data/usecases/project/remove/DbDeleteProjectById'
import { DeleteProjectById } from '../../../../domain/usecases/project/remove/DeleteProjectById'
import { makeProjectMongoRepository } from '../../repositories/projectMongoRepositoryFactory'

export const makeDbDeleteProjectById = (): DeleteProjectById => {
  const projectRepository = makeProjectMongoRepository()
  return new DbDeleteProjectById(projectRepository)
}
