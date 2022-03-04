import { ProjectModel } from './ProjectModel'

export interface FindProjectById {
  findById: (id: string) => Promise<ProjectModel>
}
