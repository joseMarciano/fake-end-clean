import { ProjectMongoRepository } from '../../../infra/project/ProjectMongoRepository'

export const makeProjectMongoRepository = (): ProjectMongoRepository => (new ProjectMongoRepository())
