import { serverError } from '../../../helper/httpHelper'
import { FakeDataModel } from '../../../../domain/usecases/fakeData/FakeDataModel'
import { HttpRequest } from '../../../protocols'
import { FindAllFakeDataController } from './FindAllFakeDataController'
import { FindAllFakeData } from '../../../../domain/usecases/fakeData/find/FindAllFakeData'

const makeFakeHttpRequest = (): HttpRequest => ({
  paths: {
    id: 'any_id'
  }
})

const makeFakeDataModel = (): FakeDataModel => ({
  id: 'any_id'
})

const makeFindAllFakeData = (): FindAllFakeData => {
  class FindAllFakeDataStub implements FindAllFakeData {
    async findAll (): Promise<FakeDataModel[]> {
      return await Promise.resolve([makeFakeDataModel()])
    }
  }

  return new FindAllFakeDataStub()
}
interface SutTypes {
  sut: FindAllFakeDataController
  findAllFakeDataStub: FindAllFakeData
}

const makeSut = (): SutTypes => {
  const findAllFakeDataStub = makeFindAllFakeData()
  const sut = new FindAllFakeDataController(findAllFakeDataStub)

  return {
    sut,
    findAllFakeDataStub
  }
}

describe('FindAllFakeDataController', () => {
  test('Should call FindAllFakeData', async () => {
    const { sut, findAllFakeDataStub } = makeSut()

    const findAllSpy = jest.spyOn(findAllFakeDataStub, 'findAll')
    await sut.handle(makeFakeHttpRequest())

    expect(findAllSpy).toHaveBeenCalled()
  })

  test('Should return FakeDataModel[] on FindAllFakeData success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse.statusCode).toEqual(200)
    expect(httpResponse.body).toEqual([makeFakeDataModel()])
  })

  test('Should return 500 on FindAllFakeData throws', async () => {
    const { sut, findAllFakeDataStub } = makeSut()

    jest.spyOn(findAllFakeDataStub, 'findAll').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(serverError(new Error()))
  })
})
