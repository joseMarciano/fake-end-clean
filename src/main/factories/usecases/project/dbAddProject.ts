import { DbAddProject } from '../../../../data/usecases/project/DbAddProject'
import { AddProject } from '../../../../domain/usecases/project/add/AddProject'
import { makeJwtAdapter } from '../../cryptography/jwtAdapterFactory'
import { makeProjectMongoRepository } from '../../repositories/projectMongoRepositoryFactory'

export const makeDbAddProject = (): AddProject => {
  const projectRepository = makeProjectMongoRepository()
  const encrypter = makeJwtAdapter(process.env.JWT_PROJECT_SECRET_KEY)
  return new DbAddProject(
    projectRepository,
    encrypter
  )
}
