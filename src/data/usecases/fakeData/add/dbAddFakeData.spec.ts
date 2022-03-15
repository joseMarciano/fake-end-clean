import { AddFakeDataRepository } from '../../../../data/protocols/fakeData/AddFakeDataRepository'
import { FakeData } from '../../../../domain/model/FakeData'
import { DbAddFakeDataa } from './DbAddFakeData'

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

const makeAddFakeDataRepository = (): AddFakeDataRepository => {
  class AddFakeDataRepositoryStub implements AddFakeDataRepository {
    async add (_data: any): Promise<FakeData> {
      return await Promise.resolve(makeFakeData())
    }
  }

  return new AddFakeDataRepositoryStub()
}

interface SutTypes {
  sut: DbAddFakeDataa
  addFakeDataRepositoryStub: AddFakeDataRepository
}
const makeSut = (): SutTypes => {
  const addFakeDataRepositoryStub = makeAddFakeDataRepository()
  const sut = new DbAddFakeDataa(addFakeDataRepositoryStub)

  return {
    sut,
    addFakeDataRepositoryStub
  }
}
describe('DbAddFakeData', () => {
  test('Should call AddFakeDataRepository with correct values', async () => {
    const { sut, addFakeDataRepositoryStub } = makeSut()

    const addProjectStub = jest.spyOn(addFakeDataRepositoryStub, 'add')
    await sut.add(makeFakeDataModel())

    expect(addProjectStub).toHaveBeenCalledWith(makeFakeDataModel())
  })

  test('Should throws if AddFakeDataRepository throw', async () => {
    const { sut, addFakeDataRepositoryStub } = makeSut()

    jest.spyOn(addFakeDataRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(makeFakeDataModel())

    await expect(promise).rejects.toThrow()
  })

  test('Should return FakeDataModel on AddFakeDataRepository success', async () => {
    const { sut } = makeSut()
    const fakeDataModel = await sut.add(makeFakeDataModel())

    expect(fakeDataModel).toEqual({
      id: 'any_id',
      ...makeFakeDataModel()
    })
  })
})
