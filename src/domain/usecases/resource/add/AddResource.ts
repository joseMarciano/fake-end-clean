import { Resource } from 'src/domain/model/Resource'
import { AddResourceError } from '../validations/AddResourceError'

export interface AddResource {
  add: (user: AddResourceModel) => Promise<Resource | AddResourceError>
}

export interface AddResourceModel {
  name: string
  project: string
}
