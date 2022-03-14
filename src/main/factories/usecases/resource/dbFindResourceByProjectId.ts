import { DbFindResourcesByProjectId } from '../../../../data/usecases/resource/findResourceByProjectId/DbFindResourcesByProjectId'
import { makeResourceMongoRepository } from '../../repositories/resourceMongoRepositoryFactory'

export const makeDbFindResourceByProjectId = (): DbFindResourcesByProjectId => {
  const resourceRepository = makeResourceMongoRepository()
  return new DbFindResourcesByProjectId(resourceRepository)
}
