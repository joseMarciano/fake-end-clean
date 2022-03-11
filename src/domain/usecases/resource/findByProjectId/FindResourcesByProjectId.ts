import { Resource } from '../../../../domain/model/Resource'

export interface FindResourcesByProjectId {
  findByProjectId: (id: string) => Promise<Resource[]>
}
