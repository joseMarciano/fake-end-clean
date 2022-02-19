import { AddProjectRepository } from '../../../data/protocols/project/AddProjectRepository'
import { FindUserByIdRepository } from '../../../data/protocols/user/FindUserByIdRepository'
import { Project } from '../../../domain/model/Project'
import { AddProject, AddProjectModel } from '../../../domain/usecases/project/add/AddProject'
import { UserNotFoundError } from '../../../domain/usecases/user/validations/UserNotFoundError'

export class DbAddProject implements AddProject {
  constructor (
    private readonly findUserByIdRepository: FindUserByIdRepository,
    private readonly addProjectRepository: AddProjectRepository
  ) {}

  async add (projectModel: AddProjectModel): Promise<Project | UserNotFoundError> {
    const user = await this.findUserByIdRepository.findById(projectModel.userId)

    if (!user) return new UserNotFoundError(`User ${projectModel.userId} not found`)

    await this.addProjectRepository.addProject(projectModel)

    return await Promise.resolve(null as unknown as Project)
  }
}
