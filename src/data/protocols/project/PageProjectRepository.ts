import { Project } from '../../../domain/model/Project'
import { Page, Pageable } from '../../../domain/usecases/commons/Page'

export interface PageProjectRepository {
  page: (pageable: Pageable) => Promise<Page<Project>>
}
