import { DbDeleteResourceById } from '../../../../data/usecases/resource/remove/DbDeleteResourceById'
import { DeleteResourceById } from '../../../../domain/usecases/resource/remove/DeleteResourceById'
import { makeResourceMongoRepository } from '../../repositories/resourceMongoRepositoryFactory'

export const makeDbDeleteResourceById = (): DeleteResourceById => {
  const resourceRepository = makeResourceMongoRepository()
  return new DbDeleteResourceById(resourceRepository)
}
