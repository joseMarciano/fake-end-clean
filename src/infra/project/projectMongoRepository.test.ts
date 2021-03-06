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

interface SutTypes {
  sut: ProjectMongoRepository
  applicationContextStub: GetUserContext
}

const makeSut = (): SutTypes => {
  const applicationContextStub = createApplicationContextStub()
  const sut = new ProjectMongoRepository(applicationContextStub)
  return {
    applicationContextStub,
    sut
  }
}

describe('ProjectMongoRepository', () => {
  let projectCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
    projectCollection = await MongoHelper.getCollection('projects')
  })

  afterAll(async () => {
    await projectCollection.deleteMany({})
    await MongoHelper.disconnect()
  })

  describe('INTERFACE AddProjectRepository', () => {
    beforeEach(async () => {
      await projectCollection.deleteMany({})
    })

    test('Should add a Project', async () => {
      const { sut } = makeSut()
      const fakeProjectModel = makeFakeProjectModel()
      const project = await sut.addProject(fakeProjectModel)

      expect(project.id).toBeTruthy()
      expect(project.description).toBe(fakeProjectModel.description)
      expect(project.secretKey).toBe(fakeProjectModel.secretKey)
      expect(project.title).toBe(fakeProjectModel.title)
    })
    test('Should throws if GetUserContext throws', async () => {
      const { sut, applicationContextStub } = makeSut()

      jest.spyOn(applicationContextStub, 'getUser').mockImplementationOnce(() => { throw new Error() })

      const fakeProjectModel = makeFakeProjectModel()
      const promise = sut.addProject(fakeProjectModel)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('INTERFACE FindProjectBYIdRepository', () => {
    beforeEach(async () => {
      await projectCollection.deleteMany({})
    })

    test('Should findProjectById', async () => {
      const { sut } = makeSut()
      const result = await projectCollection.insertOne({ ...makeFakeProjectModel(), user: 'any_id' })
      const project = await sut.findById(result.insertedId.toString())

      expect(project.id).toBe(result.insertedId.toString())
    })

    test('Should findProjectById with context user false', async () => {
      const { sut } = makeSut()
      const result = await projectCollection.insertOne({ ...makeFakeProjectModel(), user: 'any_id' })
      const project = await sut.findById(result.insertedId.toString(), false)

      expect(project.id).toBe(result.insertedId.toString())
    })

    test('Should throws if GetUserContext throws', async () => {
      const { sut, applicationContextStub } = makeSut()

      jest.spyOn(applicationContextStub, 'getUser').mockImplementationOnce(() => { throw new Error() })

      const result = await projectCollection.insertOne({ ...makeFakeProjectModel(), user: 'any_id' })
      const promise = sut.findById(result.insertedId.toString())

      await expect(promise).rejects.toThrow()
    })

    test('Should returns null if project is not found', async () => {
      const { sut } = makeSut()
      const result = await projectCollection.insertOne({ ...makeFakeProjectModel(), user: 'any_id' })
      await projectCollection.deleteMany({})
      const project = await sut.findById(result.insertedId.toString())
      expect(project).toBeNull()
    })
  })

  describe('INTERFACE PageProjectRepository', () => {
    beforeEach(async () => {
      await projectCollection.deleteMany({})
    })

    test('Should return a Page of Project', async () => {
      const { sut } = makeSut()
      const result1 = await projectCollection.insertOne({ ...makeFakeProjectModel(), user: 'any_id' })
      const result2 = await projectCollection.insertOne({ ...makeFakeProjectModel(), user: 'any_id' })
      const page = await sut.page({ limit: 7, offset: 1 })

      page.content.forEach((item) => {
        expect([result1.insertedId.toString(), result2.insertedId.toString()]).toContain(item.id)
      })

      expect(page.limit).toBe(7)
      expect(page.offset).toBe(1)
      expect(page.hasNext).toBe(false)
    })
  })

  describe('INTERFACE DeleteProjectByIdRepository', () => {
    beforeEach(async () => {
      await projectCollection.deleteMany({})
    })

    test('Should deleteById', async () => {
      const { sut } = makeSut()
      const result = await projectCollection.insertOne({ ...makeFakeProjectModel(), user: 'any_id' })
      await sut.deleteById(result.insertedId.toString())

      const project = await projectCollection.findOne({ _id: result.insertedId })
      expect(project).toBeNull()
    })

    test('Should throws if GetUserContext throws', async () => {
      const { sut, applicationContextStub } = makeSut()

      jest.spyOn(applicationContextStub, 'getUser').mockImplementationOnce(() => { throw new Error() })

      const result = await projectCollection.insertOne({ ...makeFakeProjectModel(), user: 'any_id' })
      const promise = sut.findById(result.insertedId.toString())

      await expect(promise).rejects.toThrow()
    })
  })

  describe('INTERFACE EditProjectRepository', () => {
    beforeEach(async () => {
      await projectCollection.deleteMany({})
    })

    test('Should editProject with only editable fields', async () => {
      const { sut } = makeSut()
      const result = await projectCollection.insertOne({ ...makeFakeProjectModel(), user: 'any_id' })
      await sut.edit({
        id: result.insertedId.toString(),
        description: 'edited_description',
        secretKey: 'edited_secretKey',
        title: 'edited_title',
        user: 'edited_user'
      })

      const project = await projectCollection.findOne({ _id: result.insertedId })

      expect(project).toEqual({
        _id: result.insertedId,
        description: 'edited_description',
        title: 'edited_title',
        user: 'any_id',
        secretKey: 'edited_secretKey'
      })
    })

    test('Should return an Project if edit suceeds', async () => {
      const { sut } = makeSut()
      const result = await projectCollection.insertOne({ ...makeFakeProjectModel(), user: 'any_id' })
      const project = await sut.edit({
        id: result.insertedId.toString(),
        description: 'edited_description',
        secretKey: 'edited_secretKey',
        title: 'edited_title',
        user: 'edited_user'
      })

      expect(project).toEqual({
        id: result.insertedId.toString(),
        description: 'edited_description',
        title: 'edited_title',
        user: 'any_id',
        secretKey: 'edited_secretKey'
      })
    })

    test('Should throws if GetUserContext throws', async () => {
      const { sut, applicationContextStub } = makeSut()

      jest.spyOn(applicationContextStub, 'getUser').mockImplementationOnce(() => { throw new Error() })

      const result = await projectCollection.insertOne({ ...makeFakeProjectModel(), user: 'any_id' })
      const promise = sut.findById(result.insertedId.toString())

      await expect(promise).rejects.toThrow()
    })
  })
})
