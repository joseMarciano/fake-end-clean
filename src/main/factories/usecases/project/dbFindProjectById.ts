import { DbFindProjectById } from '../../../../data/usecases/project/findById/DbFindProjectById'
import { FindProjectById } from '../../../../domain/usecases/project/find/FindProjectById'
import { makeProjectMongoRepository } from '../../repositories/projectMongoRepositoryFactory'

export const makeDbFindProjectById = (): FindProjectById => {
  const projectRepository = makeProjectMongoRepository()
  return new DbFindProjectById(projectRepository as any)
}
