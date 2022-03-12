import { DeleteResourceByIdRepository } from '../../../../data/protocols/resource/DeleteResourceByIdRepository'
import { DeleteResourceById } from '../../../../domain/usecases/resource/remove/DeleteResourceById'

export class DbDeleteResourceById implements DeleteResourceById {
  constructor (
    private readonly deleteResourceByIdRepository: DeleteResourceByIdRepository
  ) {}

  async deleteById (id: string): Promise<void> {
    await this.deleteResourceByIdRepository.deleteById(id)
  }
}
