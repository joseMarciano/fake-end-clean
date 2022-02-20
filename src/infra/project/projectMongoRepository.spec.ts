import { Collection } from 'mongodb'
import { AddProjectModel } from '../../data/protocols/project/AddProjectRepository'
import { MongoHelper } from '../db/mongo/mongoHelper'
import { ProjectMongoRepository } from './ProjectMongoRepository'

const makeFakeProjectModel = (): AddProjectModel => ({
  description: 'any_description',
  title: 'any_title',
  userId: 'any_userId',
  secretKey: 'any_secretKey'
})

const makeSut = (): ProjectMongoRepository => {
  return new ProjectMongoRepository()
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
      expect(project.user).toBe(fakeProjectModel.userId)
    })
  })
})
