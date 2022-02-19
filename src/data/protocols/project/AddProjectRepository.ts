import { Project } from '../../../domain/model/Project'
import { AddProjectModel } from '../../../domain/usecases/project/add/AddProject'

export interface AddProjectRepository {
  addProject: (projectModel: AddProjectModel) => Promise<Project>
}
