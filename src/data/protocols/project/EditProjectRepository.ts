import { Project } from '../../../domain/model/Project'

export interface EditProjectRepository {
  edit: (project: Project) => Promise<Project>
}
