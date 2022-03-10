import { Resource } from 'src/domain/model/Resource'
import { AddResourceModel } from 'src/domain/usecases/resource/add/AddResource'

export interface AddResourceRepository {
  add: (resourceModel: AddResourceModel) => Promise<Resource>
}
