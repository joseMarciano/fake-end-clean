import { ProjectMongoRepository } from 'src/infra/project/ProjectMongoRepository'

export const makeProjectMongoRepository = (): ProjectMongoRepository => (new ProjectMongoRepository())
