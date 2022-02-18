import { Project } from '../../../../domain/model/Project'
import { UserNotFoundError } from '../../user/validations/UserNotFoundError'

export interface AddProject {
  add: (projectModel: AddProjectModel) => Promise<Project | UserNotFoundError>
}

export interface AddProjectModel {
  id: string
  title: string
  description: string
  userId: string
}
