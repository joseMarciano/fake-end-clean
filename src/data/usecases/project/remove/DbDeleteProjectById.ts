import { DeleteProjectByIdRepository } from '../../../../data/protocols/project/DeleteProjectByIdRepository'
import { DeleteProjectById } from '../../../../domain/usecases/project/remove/DeleteProjectById'

export class DbDeleteProjectById implements DeleteProjectById {
  constructor (
    private readonly deleteProjectByIdRepository: DeleteProjectByIdRepository
  ) {}

  async deleteById (id: string): Promise<void> {
    await this.deleteProjectByIdRepository.deleteById(id)
  }
}
