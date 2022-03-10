import { Resource } from 'src/domain/model/Resource'

export interface FindResourceByNameRepository {
  findByName: (name: string) => Promise<Resource>
}
