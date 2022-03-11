import { Resource } from '../../../domain/model/Resource'

export interface FindResourcesByProjectIdRepository {
  findByProjectId: (id: string) => Promise<Resource[]>
}
