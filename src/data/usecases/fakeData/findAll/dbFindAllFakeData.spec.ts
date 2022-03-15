import { FindAllFakeDataRepository } from '../../../../data/protocols/fakeData/FindAllFakeDataRepository'
import { FakeData } from '../../../../domain/model/FakeData'
import { DbFindAllFakeData } from './DbFindAllFakeData'

const makeFakeData = (): FakeData => ({
  id: 'any_id',
  project: 'any_project',
  resource: 'any_resource',
  content: {
    data: 'any_data',
    otherField: 'any_field'
  }
})

const makeFakeDataModel = (): any => ({
  data: 'any_data',
  otherField: 'any_field'
})

const makeFindAllFakeDataRepository = (): FindAllFakeDataRepository => {
  class FindAllFakeDataRepositoryStub implements FindAllFakeDataRepository {
    async findAll (): Promise<FakeData[]> {
      return await Promise.resolve([makeFakeData()])
    }
  }

  return new FindAllFakeDataRepositoryStub()
}

interface SutTypes {
  sut: DbFindAllFakeData
  findFakeDataByIdRepositoryStub: FindAllFakeDataRepository
}
const makeSut = (): SutTypes => {
  const findFakeDataByIdRepositoryStub = makeFindAllFakeDataRepository()
  const sut = new DbFindAllFakeData(findFakeDataByIdRepositoryStub)

  return {
    sut,
    findFakeDataByIdRepositoryStub
  }
}
describe('DbFindAllFakeData', () => {
  test('Should call FindAllFakeDataRepository with correct values', async () => {
    const { sut, findFakeDataByIdRepositoryStub } = makeSut()

    const findFakeDataByIdRepositorySpy = jest.spyOn(findFakeDataByIdRepositoryStub, 'findAll')
    await sut.findAll()

    expect(findFakeDataByIdRepositorySpy).toHaveBeenCalled()
  })

  test('Should throws if FindAllFakeDataRepository throw', async () => {
    const { sut, findFakeDataByIdRepositoryStub } = makeSut()

    jest.spyOn(findFakeDataByIdRepositoryStub, 'findAll').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.findAll()

    await expect(promise).rejects.toThrow()
  })

  test('Should return FakeDataModel[] on FindAllFakeDataRepository success', async () => {
    const { sut } = makeSut()
    const fakeDataModel = await sut.findAll()

    expect(fakeDataModel).toEqual([{
      id: 'any_id',
      ...makeFakeDataModel()
    }])
  })
})
