import { Encrypter } from '../../../data/protocols/cryptography/Encrypter'
import { AddProjectRepository } from '../../../data/protocols/project/AddProjectRepository'
import { Project } from '../../../domain/model/Project'
import { AddProject, AddProjectModel } from '../../../domain/usecases/project/add/AddProject'

export class DbAddProject implements AddProject {
  constructor (
    private readonly addProjectRepository: AddProjectRepository,
    private readonly encrypter: Encrypter
  ) {}

  async add (projectModel: AddProjectModel): Promise<Project> {
    const secretKey = await this.encrypter.encrypt({
      ...projectModel,
      createdAt: new Date()
    })

    return await this.addProjectRepository.addProject({
      ...projectModel,
      secretKey
    })
  }
}
