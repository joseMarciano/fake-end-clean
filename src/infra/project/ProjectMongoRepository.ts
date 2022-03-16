import { FindProjectByIdRepository } from '../../data/protocols/project/FindProjectByIdRepository'
import { GetUserContext } from '../../data/protocols/application/UserContext'
import { AddProjectRepository } from '../../data/protocols/project/AddProjectRepository'
import { nonUpdatableFields, Project } from '../../domain/model/Project'
import { AddProjectModel } from '../../domain/usecases/project/add/AddProject'
import { MongoHelper } from '../db/mongo/mongoHelper'
import { ObjectId } from 'mongodb'
import { PageProjectRepository } from '../../data/protocols/project/PageProjectRepository'
import { Pageable, Page, PageUtils } from '../../domain/usecases/commons/Page'
import { DeleteProjectByIdRepository } from '../../data/protocols/project/DeleteProjectByIdRepository'
import { EditProjectRepository } from 'src/data/protocols/project/EditProjectRepository'

interface BasicRepository
  extends
  AddProjectRepository,
  FindProjectByIdRepository,
  PageProjectRepository,
  DeleteProjectByIdRepository,
  EditProjectRepository
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

  async findById (id: string): Promise<Project> {
    const userContext = await this.applicationContext.getUser()
    const collection = await MongoHelper.getCollection('projects')

    const projectDocument = await collection.findOne({
      user: userContext.id,
      _id: new ObjectId(id)
    })

    if (!projectDocument) return null as any

    const { _id, ...obj } = projectDocument as any

    return {
      id: _id.toString(),
      ...obj
    }
  }

  async page (pageable: Pageable): Promise<Page<Project>> {
    const userContext = await this.applicationContext.getUser()
    const collection = await MongoHelper.getCollection('projects')

    const filter = { user: userContext.id }

    const total = await collection.count(filter)

    const arrayDocuments = await collection.find(filter)
      .limit(pageable.limit)
      .skip(pageable.offset)
      .toArray()

    const projectModelArray = arrayDocuments.map(createProjectModel)

    return PageUtils.buildPage<Project>(pageable, total, projectModelArray)

    function createProjectModel (document: any): Project {
      const { _id, ...obj } = document
      return {
        id: _id.toString(),
        ...obj
      }
    }
  }

  async deleteById (id: string): Promise<void> {
    const userContext = await this.applicationContext.getUser()
    const collection = await MongoHelper.getCollection('projects')

    await collection.deleteOne({ user: userContext.id, _id: new ObjectId(id) })
  }

  async edit (project: Project): Promise<Project> {
    const userContext = await this.applicationContext.getUser()
    const collection = await MongoHelper.getCollection('projects')
    const projectUpdate = buildUpdateProject()

    const { value } = await collection.findOneAndUpdate(
      { _id: new ObjectId(project.id), user: userContext.id },
      { $set: projectUpdate }, { returnDocument: 'after' }
    ) as any

    if (!value) return null as any

    const { _id, ...obj } = value
    return {
      id: _id.toString(),
      ...obj
    }

    function buildUpdateProject (): any {
      const projectUpdate = {} as any
      const projectFields = Object.keys(project) as any

      projectFields
        .filter((field: string) => !nonUpdatableFields.includes(field))
        .forEach((projectField: string) => { projectUpdate[projectField] = project[projectField as keyof Project] })

      return projectUpdate
    }
  }
}
