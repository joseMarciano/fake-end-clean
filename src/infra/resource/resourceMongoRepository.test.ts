import { Collection } from 'mongodb'
import { User } from '../../domain/model/User'
import { GetUserContext } from '../../data/protocols/application/UserContext'
import { MongoHelper } from '../db/mongo/mongoHelper'
import { ResourceMongoRepository } from './ResourceMongoRepository'
import { AddResourceModel } from '../../domain/usecases/resource/add/AddResource'

const makeFakeResourceModel = (): AddResourceModel => ({
  name: 'any_name',
  project: 'any_projectId'
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
  sut: ResourceMongoRepository
  applicationContextStub: GetUserContext
}

const makeSut = (): SutTypes => {
  const applicationContextStub = createApplicationContextStub()
  const sut = new ResourceMongoRepository(applicationContextStub)
  return {
    applicationContextStub,
    sut
  }
}

describe('ResourceMongoRepository', () => {
  let resourceCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
    resourceCollection = await MongoHelper.getCollection('resources')
  })

  afterAll(async () => {
    await resourceCollection.deleteMany({})
    await MongoHelper.disconnect()
  })

  describe('INTERFACE AddResourceRepository', () => {
    beforeEach(async () => {
      await resourceCollection.deleteMany({})
    })

    test('Should add a Resource', async () => {
      const { sut } = makeSut()
      const fakeResourceModel = makeFakeResourceModel()
      const resource = await sut.add(fakeResourceModel)

      expect(resource.id).toBeTruthy()
      expect(resource.name).toBe(fakeResourceModel.name)
      expect(resource.project).toBe(fakeResourceModel.project)
      expect(resource.user).toBe('any_id')
    })

    test('Should throws if GetUserContext throws', async () => {
      const { sut, applicationContextStub } = makeSut()

      jest.spyOn(applicationContextStub, 'getUser').mockImplementationOnce(() => { throw new Error() })

      const fakeResourceModel = makeFakeResourceModel()
      const promise = sut.add(fakeResourceModel)

      await expect(promise).rejects.toThrow()
    })

    describe('INTERFACE FindResourceByNameRepository', () => {
      beforeEach(async () => {
        await resourceCollection.deleteMany({})
      })

      test('Should findResourceByName', async () => {
        const { sut } = makeSut()
        const result = await resourceCollection.insertOne({ ...makeFakeResourceModel(), user: 'any_id' })
        const resource = await sut.findByName('any_name')

        expect(resource.id).toBe(result.insertedId.toString())
      })

      test('Should throws if GetUserContext throws', async () => {
        const { sut, applicationContextStub } = makeSut()

        jest.spyOn(applicationContextStub, 'getUser').mockImplementationOnce(() => { throw new Error() })

        await resourceCollection.insertOne({ ...makeFakeResourceModel(), user: 'any_id' })
        const promise = sut.findByName('any_name')

        await expect(promise).rejects.toThrow()
      })

      test('Should returns null if resource is not found', async () => {
        const { sut } = makeSut()
        await resourceCollection.insertOne({ ...makeFakeResourceModel(), user: 'any_id' })
        await resourceCollection.deleteMany({})
        const resource = await sut.findByName('other_name')
        expect(resource).toBeNull()
      })
    })

    describe('INTERFACE FindResourcesByProjectIdRepository', () => {
      beforeEach(async () => {
        await resourceCollection.deleteMany({})
      })

      test('Should return a array of Resources by projectId', async () => {
        const { sut } = makeSut()
        const result1 = await resourceCollection.insertOne({ ...makeFakeResourceModel(), user: 'any_id' })
        const result2 = await resourceCollection.insertOne({ ...makeFakeResourceModel(), user: 'any_id' })
        const resources = await sut.findByProjectId('any_projectId')

        expect(resources).toBeTruthy()
        expect(resources.length > 0).toBe(true)
        resources.forEach((item) => {
          expect([result1.insertedId.toString(), result2.insertedId.toString()]).toContain(item.id)
          expect(['any_projectId']).toContain(item.project)
        })
      })

      test('Should return a empty array if no Resource is found', async () => {
        const { sut } = makeSut()
        const resources = await sut.findByProjectId('any_projectId')

        expect(resources).toBeTruthy()
        expect(resources.length > 0).toBe(false)
      })
    })

    describe('INTERFACE DeleteResourceByIdRepository', () => {
      beforeEach(async () => {
        await resourceCollection.deleteMany({})
      })

      test('Should deleteById', async () => {
        const { sut } = makeSut()
        const result = await resourceCollection.insertOne({ ...makeFakeResourceModel(), user: 'any_id' })
        await sut.deleteById(result.insertedId.toString())

        const resource = await resourceCollection.findOne({ _id: result.insertedId })
        expect(resource).toBeNull()
      })

      test('Should throws if GetUserContext throws', async () => {
        const { sut, applicationContextStub } = makeSut()

        jest.spyOn(applicationContextStub, 'getUser').mockImplementationOnce(() => { throw new Error() })

        const result = await resourceCollection.insertOne({ ...makeFakeResourceModel(), user: 'any_id' })
        const promise = sut.deleteById(result.insertedId.toString())

        await expect(promise).rejects.toThrow()
      })
    })
  })
})
