import { AddResource, AddResourceModel } from '../../../../domain/usecases/resource/add/AddResource'
import { AddResourceRepository } from '../../../../data/protocols/resource/AddResourceRepository'
import { FindProjectByIdRepository } from '../../../../data/protocols/project/FindProjectByIdRepository'
import { Resource } from '../../../../domain/model/Resource'
import { AddResourceError } from '../../../../domain/usecases/resource/validations/AddResourceError'
import { FindResourceByNameRepository } from '../../../../data/protocols/resource/FindResourceByNameRepository'

export class DbAddResource implements AddResource {
  constructor (
    private readonly addResourceRepository: AddResourceRepository,
    private readonly findResourceByNameRepository: FindResourceByNameRepository,
    private readonly findProjectByIdRepository: FindProjectByIdRepository
  ) {}

  async add (resourceModel: AddResourceModel): Promise<Resource | AddResourceError> {
    const project = await this.findProjectByIdRepository.findById(resourceModel.project)
    const resource = await this.findResourceByNameRepository.findByName(resourceModel.name)
    if (!project) return new AddResourceError('Project not found')
    if (resource) return new AddResourceError('Resource name already exists')

    return await this.addResourceRepository.add(resourceModel)
  }
}
