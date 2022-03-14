import { Encrypter } from '../../../protocols/cryptography/Encrypter'
import { AddProjectRepository } from '../../../protocols/project/AddProjectRepository'
import { Project } from '../../../../domain/model/Project'
import { AddProject, AddProjectModel } from '../../../../domain/usecases/project/add/AddProject'
import { EditProjectRepository } from '../../../../data/protocols/project/EditProjectRepository'

export class DbAddProject implements AddProject {
  constructor (
    private readonly addProjectRepository: AddProjectRepository,
    private readonly encrypter: Encrypter,
    private readonly editProjectRepository: EditProjectRepository
  ) {}

  async add (projectModel: AddProjectModel): Promise<Project> {
    const project = await this.addProjectRepository.addProject({ ...projectModel, secretKey: '' })

    const secretKey = await this.encrypter.encrypt(project.id)

    return await this.editProjectRepository.edit({ ...project, secretKey })
  }
}
