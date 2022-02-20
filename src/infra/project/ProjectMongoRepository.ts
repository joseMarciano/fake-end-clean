import { AddProjectRepository } from '../../data/protocols/project/AddProjectRepository'
import { Project } from '../../domain/model/Project'
import { AddProjectModel } from 'src/domain/usecases/project/add/AddProject'
import { MongoHelper } from '../db/mongo/mongoHelper'

export class ProjectMongoRepository implements AddProjectRepository {
  async addProject (projectModel: AddProjectModel): Promise<Project> {
    const collection = await MongoHelper.getCollection('projects')

    const { userId, ...others } = projectModel

    const result = await collection.insertOne({
      user: userId,
      ...others
    })

    const { _id, ...obj } = await collection.findOne({ _id: result.insertedId }) as any

    return {
      id: _id.toString(),
      ...obj
    }
  }
}
