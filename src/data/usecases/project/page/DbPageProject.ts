import { Pageable, Page } from '../../../../domain/usecases/commons/Page'
import { ProjectModel } from '../../../../domain/usecases/project/find/ProjectModel'
import { PageProject } from '../../../../domain/usecases/project/find/PageProject'
import { PageProjectRepository } from '../../../../data/protocols/project/PageProjectRepository'

export class DbPageProject implements PageProject {
  constructor (
    private readonly pageProjectRepository: PageProjectRepository
  ) {}

  async page (pageable: Pageable): Promise<Page<ProjectModel>> {
    return await this.pageProjectRepository.page(pageable)
  }
}
