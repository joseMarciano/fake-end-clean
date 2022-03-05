import { ProjectModel } from '../../../domain/usecases/project/find/ProjectModel'

export interface FindProjectByIdRepository {
  findById: (id: string) => Promise<ProjectModel>
}
