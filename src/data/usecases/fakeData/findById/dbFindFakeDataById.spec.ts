import { FindFakeDataByIdRepository } from '../../../../data/protocols/fakeData/FindFakeDataByIdRepository'
import { FakeData } from '../../../../domain/model/FakeData'
import { DbFindFakeDataById } from './DbFindFakeDataById'

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

const makeFindFakeDataByIdRepository = (): FindFakeDataByIdRepository => {
  class FindFakeDataByIdRepositoryStub implements FindFakeDataByIdRepository {
    async findById (_id: string): Promise<FakeData> {
      return await Promise.resolve(makeFakeData())
    }
  }

  return new FindFakeDataByIdRepositoryStub()
}

interface SutTypes {
  sut: DbFindFakeDataById
  findFakeDataByIdRepositoryStub: FindFakeDataByIdRepository
}
const makeSut = (): SutTypes => {
  const findFakeDataByIdRepositoryStub = makeFindFakeDataByIdRepository()
  const sut = new DbFindFakeDataById(findFakeDataByIdRepositoryStub)

  return {
    sut,
    findFakeDataByIdRepositoryStub
  }
}
describe('DbFindFakeDataById', () => {
  test('Should call FindFakeDataByIdRepository with correct values', async () => {
    const { sut, findFakeDataByIdRepositoryStub } = makeSut()

    const findFakeDataByIdRepositorySpy = jest.spyOn(findFakeDataByIdRepositoryStub, 'findById')
    await sut.findById('any_id')

    expect(findFakeDataByIdRepositorySpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return null if FindFakeDataByIdRepository returns null', async () => {
    const { sut, findFakeDataByIdRepositoryStub } = makeSut()

    jest.spyOn(findFakeDataByIdRepositoryStub, 'findById').mockResolvedValueOnce(null as any)
    const fakeData = await sut.findById('any_id')

    expect(fakeData).toBeNull()
  })

  test('Should throws if FindFakeDataByIdRepository throw', async () => {
    const { sut, findFakeDataByIdRepositoryStub } = makeSut()

    jest.spyOn(findFakeDataByIdRepositoryStub, 'findById').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.findById('any_id')

    await expect(promise).rejects.toThrow()
  })

  test('Should return FakeDataModel on FindFakeDataByIdRepository success', async () => {
    const { sut } = makeSut()
    const fakeDataModel = await sut.findById('any_id')

    expect(fakeDataModel).toEqual({
      id: 'any_id',
      ...makeFakeDataModel()
    })
  })
})
