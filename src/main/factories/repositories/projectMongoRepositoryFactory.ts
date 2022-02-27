import { ProjectMongoRepository } from '../../../infra/project/ProjectMongoRepository'
import { applicationContext } from '../application/applicationContextFactory'

export const makeProjectMongoRepository = (): ProjectMongoRepository => {
  return new ProjectMongoRepository(applicationContext)
}
