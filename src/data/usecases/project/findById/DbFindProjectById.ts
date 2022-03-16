import { Project } from '../../../../domain/model/Project'
import { FindProjectByIdRepository } from '../../../../data/protocols/project/FindProjectByIdRepository'
import { FindProjectById } from '../../../../domain/usecases/project/find/FindProjectById'

export class DbFindProjectById implements FindProjectById {
  constructor (
    private readonly findProjectByIdRepository: FindProjectByIdRepository
  ) {}

  async findById (id: string): Promise<Project> {
    return await this.findProjectByIdRepository.findById(id)
  }
}
