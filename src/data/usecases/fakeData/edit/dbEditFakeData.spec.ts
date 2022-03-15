import { EditFakeDataRepository } from '../../../../data/protocols/fakeData/EditFakeDataRepository'
import { FakeData } from '../../../../domain/model/FakeData'
import { DbEditFakeData } from './DbEditFakeData'

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

const makeEditFakeDataRepository = (): EditFakeDataRepository => {
  class EditFakeDataRepositoryStub implements EditFakeDataRepository {
    async edit (_data: any): Promise<FakeData> {
      return await Promise.resolve(makeFakeData())
    }
  }

  return new EditFakeDataRepositoryStub()
}

interface SutTypes {
  sut: DbEditFakeData
  editFakeDataRepositoryStub: EditFakeDataRepository
}
const makeSut = (): SutTypes => {
  const editFakeDataRepositoryStub = makeEditFakeDataRepository()
  const sut = new DbEditFakeData(editFakeDataRepositoryStub)

  return {
    sut,
    editFakeDataRepositoryStub
  }
}
describe('DbAddFakeData', () => {
  test('Should call EditFakeDataRepository with correct values', async () => {
    const { sut, editFakeDataRepositoryStub } = makeSut()

    const editProjectStub = jest.spyOn(editFakeDataRepositoryStub, 'edit')
    await sut.edit(makeFakeDataModel())

    expect(editProjectStub).toHaveBeenCalledWith(makeFakeDataModel())
  })

  test('Should throws if EditFakeDataRepository throw', async () => {
    const { sut, editFakeDataRepositoryStub } = makeSut()

    jest.spyOn(editFakeDataRepositoryStub, 'edit').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.edit(makeFakeDataModel())

    await expect(promise).rejects.toThrow()
  })

  test('Should return FakeDataModel on EditFakeDataRepository success', async () => {
    const { sut } = makeSut()
    const fakeDataModel = await sut.edit(makeFakeDataModel())

    expect(fakeDataModel).toEqual({
      id: 'any_id',
      ...makeFakeDataModel()
    })
  })
})
