import { Project } from '../../../domain/model/Project'

export interface FindProjectByIdRepository {
  findById: (id: string) => Promise<Project>
}
