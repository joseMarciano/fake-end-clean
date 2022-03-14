import { Resource } from '../../../domain/model/Resource'

export interface FindResourceByNameAndProjectIdRepository {
  findByNameAndProjectId: (filter: FindByNameType) => Promise<Resource>
}

export interface FindByNameType {
  name: string
  projectId: string
}
