import { FindProjectByIdRepository } from '../../../../data/protocols/project/FindProjectByIdRepository'
import { FindProjectById } from '../../../../domain/usecases/project/find/FindProjectById'
import { ProjectModel } from '../../../../domain/usecases/project/find/ProjectModel'

export class DbFindProjectById implements FindProjectById {
  constructor (
    private readonly findProjectByIdRepository: FindProjectByIdRepository
  ) {}

  async findById (id: string): Promise<ProjectModel> {
    return await this.findProjectByIdRepository.findById(id)
  }
}
