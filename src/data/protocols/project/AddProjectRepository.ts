import { Project } from '../../../domain/model/Project'

export interface AddProjectRepository {
  addProject: (projectModel: AddProjectModel) => Promise<Project>
}

interface AddProjectModel {
  title: string
  description: string
  userId: string
  secretKey: string
}
