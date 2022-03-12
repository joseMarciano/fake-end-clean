import { EditProjectRepository } from '../../../../data/protocols/project/EditProjectRepository'
import { Project } from '../../../../domain/model/Project'
import { EditProject } from '../../../../domain/usecases/project/edit/EditProject'

export class DbEditProject implements EditProject {
  constructor (
    private readonly editProjectRepository: EditProjectRepository
  ) {}

  async edit (project: Project): Promise<Project> {
    return await this.editProjectRepository.edit(project)
  }
}
