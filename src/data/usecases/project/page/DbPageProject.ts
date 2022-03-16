import { Pageable, Page } from '../../../../domain/usecases/commons/Page'
import { PageProject } from '../../../../domain/usecases/project/find/PageProject'
import { PageProjectRepository } from '../../../../data/protocols/project/PageProjectRepository'
import { Project } from '../../../../domain/model/Project'

export class DbPageProject implements PageProject {
  constructor (
    private readonly pageProjectRepository: PageProjectRepository
  ) {}

  async page (pageable: Pageable): Promise<Page<Project>> {
    return await this.pageProjectRepository.page(pageable)
  }
}
