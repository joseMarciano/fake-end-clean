import { Collection } from 'mongodb'
import { MongoHelper } from '../db/mongo/mongoHelper'
import { FakeDataMongoRepository } from './FakeDataMongoRepository'
import { FakeContext, GetFakeContext } from '../../data/protocols/application/fakeData/ApplicationContextFake'
import { Resource } from '../../domain/model/Resource'
import { Project } from 'src/domain/model/Project'

const makeFakeProject = (): Project => ({
  id: 'any_id',
  secretKey: '',
  description: 'any_description',
  title: 'any_title',
  user: 'any_userId'
})

const makeFakeResource = (): Resource => ({
  id: 'any_id',
  name: 'any_name',
  project: 'any_id',
  user: 'any_id'
})

const makeFakeData = (): any => ({
  field: 'any_field',
  otherField: 'other_field'
})

const createFakeApplicationContextStub = (): GetFakeContext => {
  class ApplicationContextStub implements GetFakeContext {
    async getFakeContext (): Promise<FakeContext> {
      return await Promise.resolve({
        project: makeFakeProject(),
        resource: makeFakeResource()
      })
    }
  }

  return new ApplicationContextStub()
}

interface SutTypes {
  sut: FakeDataMongoRepository
  applicationContextStub: GetFakeContext
}

const makeSut = (): SutTypes => {
  const applicationContextStub = createFakeApplicationContextStub()
  const sut = new FakeDataMongoRepository(applicationContextStub)
  return {
    applicationContextStub,
    sut
  }
}

describe('FakeDataMongoRepository', () => {
  let resourceCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
    resourceCollection = await MongoHelper.getCollection('fakeDatas')
  })

  afterAll(async () => {
    await resourceCollection.deleteMany({})
    await MongoHelper.disconnect()
  })

  describe('INTERFACE AddFakeDataRepository', () => {
    beforeEach(async () => {
      await resourceCollection.deleteMany({})
    })

    test('Should add a FakeData', async () => {
      const { sut } = makeSut()
      const fakeDataModel = makeFakeData()
      const fakeData = await sut.add(fakeDataModel)

      expect(fakeData.id).toBeTruthy()
      expect(fakeData.content.field).toBe(fakeDataModel.field)
      expect(fakeData.content.otherField).toBe(fakeDataModel.otherField)
      expect(fakeData.project).toBe(makeFakeProject().id)
      expect(fakeData.resource).toBe(makeFakeResource().id)
    })

    test('Should throws if GetFakeContext throws', async () => {
      const { sut, applicationContextStub } = makeSut()
      jest.spyOn(applicationContextStub, 'getFakeContext').mockImplementationOnce(() => { throw new Error() })
      const fakeDataModel = makeFakeData()
      const promise = sut.add(fakeDataModel)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('INTERFACE FindFakeDataBYIdRepository', () => {
    beforeEach(async () => {
      await resourceCollection.deleteMany({})
    })

    test('Should findFakeDataById', async () => {
      const { sut } = makeSut()
      const project = makeFakeProject()
      const resource = makeFakeResource()

      const result = await resourceCollection.insertOne({ project: project.id, resource: resource.id, content: makeFakeData() })
      const fakeData = await sut.findById(result.insertedId.toString())

      expect(fakeData.id).toBe(result.insertedId.toString())
    })

    test('Should throws if GetFakeContext throws', async () => {
      const { sut, applicationContextStub } = makeSut()
      jest.spyOn(applicationContextStub, 'getFakeContext').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.findById('any')
      await expect(promise).rejects.toThrow()
    })

    test('Should returns null if fakeData is not found', async () => {
      const { sut } = makeSut()
      const project = makeFakeProject()
      const resource = makeFakeResource()
      const result = await resourceCollection.insertOne({ project: project.id, resource: resource.id, content: makeFakeData() })
      await resourceCollection.deleteMany({})
      const fakeData = await sut.findById(result.insertedId.toString())
      expect(fakeData).toBeNull()
    })
  })

  describe('INTERFACE PageFakeDataRepository', () => {
    beforeEach(async () => {
      await resourceCollection.deleteMany({})
    })

    test('Should return a Page of FakeData', async () => {
      const { sut } = makeSut()

      const project = makeFakeProject()
      const resource = makeFakeResource()

      const result1 = await resourceCollection.insertOne({ project: project.id, resource: resource.id, content: makeFakeData() })
      const result2 = await resourceCollection.insertOne({ project: project.id, resource: resource.id, content: makeFakeData() })
      const page = await sut.page({ limit: 7, offset: 1 })

      page.content.forEach((item) => {
        expect([result1.insertedId.toString(), result2.insertedId.toString()]).toContain(item.id)
      })

      expect(page.limit).toBe(7)
      expect(page.offset).toBe(1)
      expect(page.hasNext).toBe(false)
    })

    test('Should throws if GetFakeContext throws', async () => {
      const { sut, applicationContextStub } = makeSut()
      jest.spyOn(applicationContextStub, 'getFakeContext').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.page({ limit: 7, offset: 1 })
      await expect(promise).rejects.toThrow()
    })
  })

  describe('INTERFACE FindAllFakeDataRepository', () => {
    beforeEach(async () => {
      await resourceCollection.deleteMany({})
    })

    test('Should return a array of FakeData', async () => {
      const { sut } = makeSut()

      const project = makeFakeProject()
      const resource = makeFakeResource()

      const result1 = await resourceCollection.insertOne({ project: project.id, resource: resource.id, content: makeFakeData() })
      const result2 = await resourceCollection.insertOne({ project: project.id, resource: resource.id, content: makeFakeData() })
      const fakeDataModelArray = await sut.findAll()

      expect(fakeDataModelArray.length > 0).toBe(true)
      fakeDataModelArray.forEach((item) => {
        expect([result1.insertedId.toString(), result2.insertedId.toString()]).toContain(item.id)
      })
    })

    test('Should return a empty array if no FakeData is found', async () => {
      const { sut } = makeSut()
      const fakeDataModelArray = await sut.findAll()
      expect(fakeDataModelArray.length > 0).toBe(false)
    })

    test('Should throws if GetFakeContext throws', async () => {
      const { sut, applicationContextStub } = makeSut()
      jest.spyOn(applicationContextStub, 'getFakeContext').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.findAll()
      await expect(promise).rejects.toThrow()
    })
  })

  describe('INTERFACE DeleteFakeDataByIdRepository', () => {
    beforeEach(async () => {
      await resourceCollection.deleteMany({})
    })

    test('Should deleteById', async () => {
      const { sut } = makeSut()

      const project = makeFakeProject()
      const resource = makeFakeResource()

      const result = await resourceCollection.insertOne({ project: project.id, resource: resource.id, content: makeFakeData() })
      await sut.deleteById(result.insertedId.toString())

      const fakeData = await resourceCollection.findOne({ _id: result.insertedId })
      expect(fakeData).toBeNull()
    })

    test('Should throws if GetFakeContext throws', async () => {
      const { sut, applicationContextStub } = makeSut()
      jest.spyOn(applicationContextStub, 'getFakeContext').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.deleteById('any')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('INTERFACE EditFakeDataRepository', () => {
    beforeEach(async () => {
      await resourceCollection.deleteMany({})
    })

    test('Should editFakeData', async () => {
      const { sut } = makeSut()

      const project = makeFakeProject()
      const resource = makeFakeResource()

      const result = await resourceCollection.insertOne({ project: project.id, resource: resource.id, content: makeFakeData() })

      await sut.edit({ id: result.insertedId.toString(), field: 'edited_field', otherField: 'edited_other' } as any)

      const fakeData = await resourceCollection.findOne({ _id: result.insertedId })

      expect(fakeData).toEqual({
        _id: result.insertedId,
        content: {
          field: 'edited_field',
          otherField: 'edited_other'
        },
        project: 'any_id',
        resource: 'any_id'
      })
    })

    test('Should return an FakeData if edit suceeds', async () => {
      const { sut } = makeSut()

      const project = makeFakeProject()
      const resource = makeFakeResource()

      const result = await resourceCollection.insertOne({ project: project.id, resource: resource.id, content: makeFakeData() })

      const fakeData = await sut.edit({ id: result.insertedId.toString(), field: 'edited_field', otherField: 'edited_other' } as any)

      expect(fakeData).toEqual({
        id: result.insertedId.toString(),
        content: {
          field: 'edited_field',
          otherField: 'edited_other'
        },
        project: 'any_id',
        resource: 'any_id'
      })
    })

    test('Should throws if GetFakeContext throws', async () => {
      const { sut, applicationContextStub } = makeSut()
      jest.spyOn(applicationContextStub, 'getFakeContext').mockImplementationOnce(() => { throw new Error() })
      const fakeDataModel = makeFakeData()
      const promise = sut.edit(fakeDataModel)
      await expect(promise).rejects.toThrow()
    })
  })
})
