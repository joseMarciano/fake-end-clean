import { FindUserByIdRepository } from 'src/data/protocols/user/FindUserByIdRepository'
import { Project } from 'src/domain/model/Project'
import { AddProject, AddProjectModel } from 'src/domain/usecases/project/add/AddProject'
import { UserNotFoundError } from 'src/domain/usecases/user/validations/UserNotFoundError'

export class DbAddProject implements AddProject {
  constructor (
    private readonly findUserByIdRepository: FindUserByIdRepository
  ) {}

  async add (projectModel: AddProjectModel): Promise<Project | UserNotFoundError> {
    await this.findUserByIdRepository.findById(projectModel.userId)
    return await Promise.resolve(null as unknown as Project)
  }
}
