import { FindProjectByIdRepository } from '../../data/protocols/project/FindProjectByIdRepository'
import { GetUserContext } from '../../data/protocols/application/UserContext'
import { AddProjectRepository } from '../../data/protocols/project/AddProjectRepository'
import { Project } from '../../domain/model/Project'
import { AddProjectModel } from '../../domain/usecases/project/add/AddProject'
import { MongoHelper } from '../db/mongo/mongoHelper'
import { ProjectModel } from '../../domain/usecases/project/find/ProjectModel'
import { ObjectId } from 'mongodb'

interface BasicRepository
  extends
  AddProjectRepository,
  FindProjectByIdRepository
{}
export class ProjectMongoRepository implements BasicRepository {
  constructor (private readonly applicationContext: GetUserContext) {}

  async addProject (projectModel: AddProjectModel): Promise<Project> {
    const user = await this.applicationContext.getUser()

    const collection = await MongoHelper.getCollection('projects')

    const result = await collection.insertOne({
      user: user.id,
      ...projectModel
    })

    const { _id, ...obj } = await collection.findOne({ _id: result.insertedId }) as any

    return {
      id: _id.toString(),
      ...obj
    }
  }

  async findById (id: string): Promise<ProjectModel> {
    const userContext = await this.applicationContext.getUser()
    const collection = await MongoHelper.getCollection('projects')

    const projectDocument = await collection.findOne({
      user: userContext.id,
      _id: new ObjectId(id)
    })

    if (!projectDocument) return null as any

    const { _id, user, ...obj } = projectDocument as any

    return {
      id: _id.toString(),
      ...obj
    }
  }
}
