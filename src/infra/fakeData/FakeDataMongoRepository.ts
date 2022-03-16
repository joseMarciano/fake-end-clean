import { FakeData } from '../../domain/model/FakeData'
import { GetFakeContext } from '../../data/protocols/application/fakeData/ApplicationContextFake'
import { AddFakeDataRepository } from '../../data/protocols/fakeData/AddFakeDataRepository'
import { MongoHelper } from '../db/mongo/mongoHelper'
import { EditFakeDataRepository } from '../../data/protocols/fakeData/EditFakeDataRepository'
import { FakeDataModel } from '../../domain/usecases/fakeData/FakeDataModel'
import { Filter, ObjectId } from 'mongodb'
import { PageFakeDataRepository } from '../../data/protocols/fakeData/PageFakeDataRepository'
import { Pageable, Page, PageUtils } from '../../domain/usecases/commons/Page'
import { DeleteFakeDataByIdRepository } from '../../data/protocols/fakeData/DeleteFakeDataByIdRepository'
import { FindAllFakeDataRepository } from '../../data/protocols/fakeData/FindAllFakeDataRepository'
import { FindFakeDataByIdRepository } from '../../data/protocols/fakeData/FindFakeDataByIdRepository'

interface BasicRepository
  extends
  AddFakeDataRepository,
  EditFakeDataRepository,
  PageFakeDataRepository,
  DeleteFakeDataByIdRepository,
  FindAllFakeDataRepository,
  FindFakeDataByIdRepository
{}
export class FakeDataMongoRepository implements BasicRepository {
  constructor (private readonly applicationContext: GetFakeContext) {}

  async add (data: any): Promise<FakeData> {
    const collection = await MongoHelper.getCollection('fakeDatas')
    const context = await this.applicationContext.getFakeContext()

    const result = await collection.insertOne({
      content: data,
      project: context.project.id,
      resource: context.resource.id
    })

    const { _id, ...obj } = await collection.findOne({ _id: result.insertedId }) as any

    return {
      id: _id.toString(),
      ...obj
    }
  }

  async edit (data: FakeDataModel): Promise<FakeData> {
    const { id, ...dataObj } = data
    const collection = await MongoHelper.getCollection('fakeDatas')
    const context = await this.applicationContext.getFakeContext()

    const { value } = await collection.findOneAndUpdate(
      { _id: new ObjectId(id), project: context.project.id, resource: context.resource.id },
      {
        $set: {
          content: dataObj
        }
      }, { returnDocument: 'after' }
    ) as any

    if (!value) return null as any

    const { _id, ...obj } = value
    return {
      id: _id.toString(),
      ...obj
    }
  }

  async page (pageable: Pageable): Promise<Page<FakeData>> {
    const collection = await MongoHelper.getCollection('fakeDatas')
    const context = await this.applicationContext.getFakeContext()

    const filter = {
      project: context.project.id,
      resource: context.resource.id
    }

    const total = await collection.count(filter)

    const arrayDocuments = await collection.find(filter)
      .limit(pageable.limit)
      .skip(pageable.offset)
      .toArray()

    const fakeDataModelArray = arrayDocuments.map(createFakeDataModel)

    return PageUtils.buildPage<FakeData>(pageable, total, fakeDataModelArray)
  }

  async deleteById (id: string): Promise<void> {
    const collection = await MongoHelper.getCollection('fakeDatas')
    const context = await this.applicationContext.getFakeContext()

    const filter = {
      _id: new ObjectId(id),
      project: context.project.id,
      resource: context.resource.id
    }

    await collection.deleteOne(filter)
  }

  async findAll (): Promise<FakeDataModel[]> {
    const collection = await MongoHelper.getCollection('fakeDatas')
    const context = await this.applicationContext.getFakeContext()

    const filter = {
      project: context.project.id,
      resource: context.resource.id
    }

    const arrayDocuments = await collection.find(filter).toArray()
    return arrayDocuments.map(createFakeDataModel)
  }

  async findById (id: string): Promise<FakeData> {
    const collection = await MongoHelper.getCollection('fakeDatas')
    const context = await this.applicationContext.getFakeContext()

    const filter = {
      _id: new ObjectId(id),
      project: context.project.id,
      resource: context.resource.id
    }

    const fakeDataDocument = await collection.findOne(filter as Filter<any>)

    if (!fakeDataDocument) return null as any

    const { _id, ...obj } = fakeDataDocument as any

    return {
      id: _id.toString(),
      ...obj
    }
  }
  // async findById (id: string, useContext = true): Promise<Project> {
  //   const collection = await MongoHelper.getCollection('projects')
  //   const filter = {
  //     _id: new ObjectId(id)
  //   } as any

  //   if (useContext) {
  //     const userContext = await this.applicationContext.getUser()
  //     filter.user = userContext.id
  //   }

  //   const projectDocument = await collection.findOne(filter as Filter<any>)

  //   if (!projectDocument) return null as any

  //   const { _id, ...obj } = projectDocument as any

  //   return {
  //     id: _id.toString(),
  //     ...obj
  //   }
  // }
  // async deleteById (id: string): Promise<void> {
  //   const userContext = await this.applicationContext.getUser()
  //   const collection = await MongoHelper.getCollection('projects')

  //   await collection.deleteOne({ user: userContext.id, _id: new ObjectId(id) })
  // }

  // async page (pageable: Pageable): Promise<Page<Project>> {
  //   const userContext = await this.applicationContext.getUser()
  //   const collection = await MongoHelper.getCollection('projects')

  //   const filter = { user: userContext.id }

  //   const total = await collection.count(filter)

  //   const arrayDocuments = await collection.find(filter)
  //     .limit(pageable.limit)
  //     .skip(pageable.offset)
  //     .toArray()

  //   const projectModelArray = arrayDocuments.map(createProjectModel)

  //   return PageUtils.buildPage<Project>(pageable, total, projectModelArray)

  //   function createProjectModel (document: any): Project {
  //     const { _id, ...obj } = document
  //     return {
  //       id: _id.toString(),
  //       ...obj
  //     }
  //   }
  // }

  // async edit (project: Project): Promise<Project> {
  //   const userContext = await this.applicationContext.getUser()
  //   const collection = await MongoHelper.getCollection('projects')
  //   const projectUpdate = buildUpdateProject()

  //   const { value } = await collection.findOneAndUpdate(
  //     { _id: new ObjectId(project.id), user: userContext.id },
  //     { $set: projectUpdate }, { returnDocument: 'after' }
  //   ) as any

  //   if (!value) return null as any

  //   const { _id, ...obj } = value
  //   return {
  //     id: _id.toString(),
  //     ...obj
  //   }

  // async addProject (projectModel: AddProjectModel): Promise<Project> {
  //   const user = await this.applicationContext.getUser()

  //   const collection = await MongoHelper.getCollection('projects')

  //   const result = await collection.insertOne({
  //     user: user.id,
  //     ...projectModel
  //   })

  //   const { _id, ...obj } = await collection.findOne({ _id: result.insertedId }) as any

  //   return {
  //     id: _id.toString(),
  //     ...obj
  //   }
  // }

  // async deleteById (id: string): Promise<void> {
  //   const userContext = await this.applicationContext.getUser()
  //   const collection = await MongoHelper.getCollection('projects')

  //   await collection.deleteOne({ user: userContext.id, _id: new ObjectId(id) })
  // }

  //   function buildUpdateProject (): any {
  //     const projectUpdate = {} as any
  //     const projectFields = Object.keys(project) as any

  //     projectFields
  //       .filter((field: string) => !nonUpdatableFields.includes(field))
  //       .forEach((projectField: string) => { projectUpdate[projectField] = project[projectField as keyof Project] })

  //     return projectUpdate
  //   }
  // }
}

function createFakeDataModel (document: any): FakeData {
  const { _id, ...obj } = document
  return {
    id: _id.toString(),
    ...obj
  }
}
