import { Collection } from 'mongodb'
import { User } from '../../domain/model/User'
import { GetUserContext } from '../../data/protocols/application/UserContext'
import { AddProjectModel } from '../../data/protocols/project/AddProjectRepository'
import { MongoHelper } from '../db/mongo/mongoHelper'
import { ProjectMongoRepository } from './ProjectMongoRepository'

const makeFakeProjectModel = (): AddProjectModel => ({
  description: 'any_description',
  title: 'any_title',
  secretKey: 'any_secretKey'
})

const createApplicationContextStub = (): GetUserContext => {
  class ApplicationContextStub implements GetUserContext {
    async getUser (): Promise<User> {
      return {
        id: 'any_id',
        email: 'any_email',
        isActive: true,
        name: 'any_name',
        password: 'any_password'
      }
    }
  }

  return new ApplicationContextStub()
}

const makeSut = (): ProjectMongoRepository => {
  const applicationContextStub = createApplicationContextStub()
  return new ProjectMongoRepository(applicationContextStub)
}

describe('ProjectMongoRepository', () => {
  let projectCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
    projectCollection = await MongoHelper.getCollection('projects')
  })
  beforeEach(async () => {
    await projectCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('INTERFACE AddProjectRepository', () => {
    test('Should add a Project', async () => {
      const sut = makeSut()
      const fakeProjectModel = makeFakeProjectModel()
      const project = await sut.addProject(fakeProjectModel)

      expect(project.id).toBeTruthy()
      expect(project.description).toBe(fakeProjectModel.description)
      expect(project.secretKey).toBe(fakeProjectModel.secretKey)
      expect(project.title).toBe(fakeProjectModel.title)
    })
  })
})
