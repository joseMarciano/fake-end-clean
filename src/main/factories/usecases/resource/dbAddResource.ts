import { DbAddResource } from '../../../../data/usecases/resource/add/DbAddResource'
import { makeProjectMongoRepository } from '../../repositories/projectMongoRepositoryFactory'
import { makeResourceMongoRepository } from '../../repositories/resourceMongoRepositoryFactory'

export const makeDbAddResource = (): DbAddResource => {
  const resourceRepository = makeResourceMongoRepository()
  const projectRepository = makeProjectMongoRepository()
  return new DbAddResource(resourceRepository, resourceRepository, projectRepository)
}
