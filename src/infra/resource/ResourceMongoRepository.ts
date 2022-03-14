import { AddResourceRepository } from '../../data/protocols/resource/AddResourceRepository'
import { GetUserContext } from '../../data/protocols/application/UserContext'
import { AddResourceModel } from '../../domain/usecases/resource/add/AddResource'
import { Resource } from '../../domain/model/Resource'
import { MongoHelper } from '../db/mongo/mongoHelper'
import { FindResourcesByProjectIdRepository } from '../../data/protocols/resource/FindResourceByProjectIdRepository'
import { DeleteResourceByIdRepository } from '../../data/protocols/resource/DeleteResourceByIdRepository'
import { FindResourceByNameAndProjectIdRepository, FindByNameType } from '../../data/protocols/resource/FindResourceByNameAndProjectIdRepository'
import { ObjectId } from 'mongodb'

interface BasicRepository
  extends
  AddResourceRepository,
  FindResourcesByProjectIdRepository,
  FindResourceByNameAndProjectIdRepository,
  DeleteResourceByIdRepository

{}
export class ResourceMongoRepository implements BasicRepository {
  constructor (private readonly applicationContext: GetUserContext) {}

  async add (resourceModel: AddResourceModel): Promise<Resource> {
    const userContext = await this.applicationContext.getUser()
    const collection = await MongoHelper.getCollection('resources')

    const result = await collection.insertOne({
      user: userContext.id,
      ...resourceModel
    })

    const { _id, ...obj } = await collection.findOne({ _id: result.insertedId }) as any

    return {
      id: _id.toString(),
      ...obj
    }
  }

  async findByNameAndProjectId (filter: FindByNameType): Promise<Resource> {
    const userContext = await this.applicationContext.getUser()
    const collection = await MongoHelper.getCollection('resources')

    const resourceDocument = await collection.findOne({
      user: userContext.id,
      name: filter.name,
      project: filter.projectId
    })

    if (!resourceDocument) return null as any

    const { _id, ...obj } = resourceDocument as any

    return {
      id: _id.toString(),
      ...obj
    }
  }

  async findByProjectId (id: string): Promise<Resource[]> {
    const userContext = await this.applicationContext.getUser()
    const collection = await MongoHelper.getCollection('resources')

    const arrayDocuments = await collection.find({
      user: userContext.id,
      project: id
    }).toArray()

    if (!arrayDocuments) return [] as any

    return arrayDocuments.map(createResourceModel)

    function createResourceModel (document: any): Resource {
      const { _id, ...obj } = document
      return {
        id: _id.toString(),
        ...obj
      }
    }
  }

  async deleteById (id: string): Promise<void> {
    const userContext = await this.applicationContext.getUser()
    const collection = await MongoHelper.getCollection('resources')

    await collection.deleteOne({ user: userContext.id, _id: new ObjectId(id) })
  }
}
