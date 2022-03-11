import { FindResourcesByProjectId } from '../../../../domain/usecases/resource/findByProjectId/FindResourcesByProjectId'
import { Resource } from '../../../../domain/model/Resource'
import { FindResourcesByProjectIdRepository } from '../../../../data/protocols/resource/FindResourceByProjectIdRepository'

export class DbFindResourcesByProjectId implements FindResourcesByProjectId {
  constructor (
    private readonly findResourcesByProjectIdRepository: FindResourcesByProjectIdRepository
  ) {}

  async findByProjectId (id: string): Promise<Resource[]> {
    if (!id) return [] as Resource[]
    return await this.findResourcesByProjectIdRepository.findByProjectId(id)
  }
}
