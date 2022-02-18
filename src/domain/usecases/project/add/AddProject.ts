import { Project } from '../../../../domain/model/Project'

export interface AddProject {
  add: (projectModel: AddProjectModel) => Promise<Project>
}

export interface AddProjectModel {
  id: string
  title: string
  description: string
  userId: string
}
