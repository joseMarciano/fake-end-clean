import { GetUserContext } from '../../data/protocols/application/UserContext'
import { AddProjectRepository } from '../../data/protocols/project/AddProjectRepository'
import { Project } from '../../domain/model/Project'
import { AddProjectModel } from '../../domain/usecases/project/add/AddProject'
import { MongoHelper } from '../db/mongo/mongoHelper'

export class ProjectMongoRepository implements AddProjectRepository {
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
}
