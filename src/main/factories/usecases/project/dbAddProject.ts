import { DbAddProject } from '../../../../data/usecases/project/DbAddProject'
import { AddProject } from '../../../../domain/usecases/project/add/AddProject'
import { makeJwtAdapter } from '../../cryptography/jwtAdapterFactory'
import { makeProjectMongoRepository } from '../../repositories/projectMongoRepositoryFactory'
import { makeUserMongoRepository } from '../../repositories/userMongoRepositoryFactory'

export const makeDbAddProject = (): AddProject => {
  const userRepository = makeUserMongoRepository()
  const projectRepository = makeProjectMongoRepository()
  const encrypter = makeJwtAdapter(process.env.JWT_PROJECT_SECRET_KEY)
  return new DbAddProject(
    userRepository,
    projectRepository,
    encrypter
  )
}
