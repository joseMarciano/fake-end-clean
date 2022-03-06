import { Page, Pageable } from '../../commons/Page'
import { ProjectModel } from './ProjectModel'

export interface PageProject {
  page: (pageable: Pageable) => Promise<Page<ProjectModel>>
}
