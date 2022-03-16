import { Resource } from '../../../domain/model/Resource'
import { AddResourceModel } from '../../../domain/usecases/resource/add/AddResource'

export interface AddResourceRepository {
  add: (resourceModel: AddResourceModel) => Promise<Resource>
}
