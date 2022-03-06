import { Page, Pageable } from '../../../domain/usecases/commons/Page'
import { ProjectModel } from '../../../domain/usecases/project/find/ProjectModel'

export interface PageProjectRepository {
  page: (pageable: Pageable) => Promise<Page<ProjectModel>>
}
