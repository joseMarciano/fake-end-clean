import { serverError } from '../../../helper/httpHelper'
import { FakeDataModel } from '../../../../domain/usecases/fakeData/FakeDataModel'
import { HttpRequest } from '../../../protocols'
import { FindFakeDataByIdController } from './FindFakeDataByIdController'
import { FindFakeDataById } from '../../../../domain/usecases/fakeData/find/FindFakeDataById'

const makeFakeHttpRequest = (): HttpRequest => ({
  paths: {
    id: 'any_id'
  }
})

const makeFakeDataModel = (): FakeDataModel => ({
  id: 'any_id'
})

const makeFindFakeDataById = (): FindFakeDataById => {
  class FindFakeDataByIdStub implements FindFakeDataById {
    async findById (_id: string): Promise<FakeDataModel> {
      return await Promise.resolve(makeFakeDataModel())
    }
  }

  return new FindFakeDataByIdStub()
}
interface SutTypes {
  sut: FindFakeDataByIdController
  findFakeDataByIdStub: FindFakeDataById
}

const makeSut = (): SutTypes => {
  const findFakeDataByIdStub = makeFindFakeDataById()
  const sut = new FindFakeDataByIdController(findFakeDataByIdStub)

  return {
    sut,
    findFakeDataByIdStub
  }
}

describe('FindFakeDataByIdController', () => {
  test('Should call FindFakeDataById with correct values ', async () => {
    const { sut, findFakeDataByIdStub } = makeSut()

    const editSpy = jest.spyOn(findFakeDataByIdStub, 'findById')
    await sut.handle(makeFakeHttpRequest())

    expect(editSpy).toHaveBeenCalledWith(makeFakeHttpRequest().paths.id)
  })

  test('Should return FakeDataModel on FindFakeDataById success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse.statusCode).toEqual(200)
    expect(httpResponse.body).toEqual(makeFakeDataModel())
  })

  test('Should return 500 on FindFakeDataById throws', async () => {
    const { sut, findFakeDataByIdStub } = makeSut()

    jest.spyOn(findFakeDataByIdStub, 'findById').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(serverError(new Error()))
  })
})
