import { Project } from '../../../../domain/model/Project'

export interface EditProject {
  edit: (project: Project) => Promise<Project>
}
