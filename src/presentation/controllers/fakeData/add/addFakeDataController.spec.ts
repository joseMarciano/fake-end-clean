import { FakeData } from '../../../../domain/model/FakeData'
import { AddFakeData } from '../../../../domain/usecases/fakeData/add/AddFakeData'
import { HttpRequest } from '../../../../presentation/protocols'
import { AddFakeDataController } from './AddFakeDataController'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    data: 'any_data',
    otherField: 'any_field'
  }
})

const makeFakeData = (): FakeData => ({
  id: 'any_id',
  project: 'any_id',
  resource: 'any_id',
  content: {
    data: 'any_data',
    otherField: 'any_field'
  }
})

const makeAddFakeData = (): AddFakeData => {
  class AddFakeDataStub implements AddFakeData {
    async add (_data: any): Promise<FakeData> {
      return await Promise.resolve(makeFakeData())
    }
  }

  return new AddFakeDataStub()
}

interface SutTypes {
  sut: AddFakeDataController
  addFakeDataStub: AddFakeData
}

const makeSut = (): SutTypes => {
  const addFakeDataStub = makeAddFakeData()
  const sut = new AddFakeDataController(addFakeDataStub)

  return {
    sut,
    addFakeDataStub
  }
}

describe('AddFakeDataController', () => {
  test('Should call AddFakeData with correct values ', async () => {
    const { sut, addFakeDataStub } = makeSut()

    const addSpy = jest.spyOn(addFakeDataStub, 'add')
    await sut.handle(makeFakeHttpRequest())

    expect(addSpy).toHaveBeenCalledWith(makeFakeHttpRequest().body)
  })
})
