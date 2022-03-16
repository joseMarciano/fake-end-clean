import { Project } from '../../../../domain/model/Project'
import { Page, Pageable } from '../../commons/Page'

export interface PageProject {
  page: (pageable: Pageable) => Promise<Page<Project>>
}
