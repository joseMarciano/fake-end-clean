import { Project } from '../../../../domain/model/Project'

export interface FindProjectById {
  findById: (id: string) => Promise<Project>
}
