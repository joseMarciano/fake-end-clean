import { FakeDataModel } from '../../../../domain/usecases/fakeData/FakeDataModel'
import { AddFakeData } from '../../../../domain/usecases/fakeData/add/AddFakeData'
import { HttpRequest } from '../../../../presentation/protocols'
import { AddFakeDataController } from './AddFakeDataController'
import { serverError } from '../../../../presentation/helper/httpHelper'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    data: 'any_data',
    otherField: 'any_field'
  }
})

const makeFakeDataModel = (): FakeDataModel => ({
  id: 'any_id',
  content: {
    data: 'any_data',
    otherField: 'any_field'
  }
})

const makeAddFakeData = (): AddFakeData => {
  class AddFakeDataStub implements AddFakeData {
    async add (_data: any): Promise<FakeDataModel> {
      return await Promise.resolve(makeFakeDataModel())
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

  test('Should return FakeDataModel on AddFakeData success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse.statusCode).toEqual(200)
    expect(httpResponse.body).toEqual(makeFakeDataModel())
  })

  test('Should return 500 on AddFakeData throws', async () => {
    const { sut, addFakeDataStub } = makeSut()

    jest.spyOn(addFakeDataStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(serverError(new Error()))
  })
})
