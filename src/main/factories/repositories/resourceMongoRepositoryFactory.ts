import { ResourceMongoRepository } from '../../../infra/resource/ResourceMongoRepository'
import { applicationContext } from '../application/applicationContextFactory'

export const makeResourceMongoRepository = (): ResourceMongoRepository => {
  return new ResourceMongoRepository(applicationContext)
}
