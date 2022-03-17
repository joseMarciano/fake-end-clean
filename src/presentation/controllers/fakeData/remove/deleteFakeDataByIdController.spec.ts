import { serverError } from '../../../helper/httpHelper'
import { HttpRequest } from '../../../protocols'
import { DeleteFakeDataById } from '../../../../domain/usecases/fakeData/remove/DeleteFakeDataById'
import { DeleteFakeDataByIdController } from './DeleteFakeDataByIdController'

const makeFakeHttpRequest = (): HttpRequest => ({
  paths: {
    id: 'any_id'
  }
})

const makeDeleteFakeDataById = (): DeleteFakeDataById => {
  class DeleteFakeDataByIdStub implements DeleteFakeDataById {
    async deleteById (_id: string): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new DeleteFakeDataByIdStub()
}
interface SutTypes {
  sut: DeleteFakeDataByIdController
  deleteFakeDataByIdStub: DeleteFakeDataById
}

const makeSut = (): SutTypes => {
  const deleteFakeDataByIdStub = makeDeleteFakeDataById()
  const sut = new DeleteFakeDataByIdController(deleteFakeDataByIdStub)

  return {
    sut,
    deleteFakeDataByIdStub
  }
}

describe('DeleteFakeDataByIdController', () => {
  test('Should call DeleteFakeDataById with correct values ', async () => {
    const { sut, deleteFakeDataByIdStub } = makeSut()

    const deleteSpy = jest.spyOn(deleteFakeDataByIdStub, 'deleteById')
    await sut.handle(makeFakeHttpRequest())

    expect(deleteSpy).toHaveBeenCalledWith(makeFakeHttpRequest().paths.id)
  })

  test('Should return FakeDataModel on DeleteFakeDataById success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse.statusCode).toEqual(204)
  })

  test('Should return 500 on DeleteFakeDataById throws', async () => {
    const { sut, deleteFakeDataByIdStub } = makeSut()

    jest.spyOn(deleteFakeDataByIdStub, 'deleteById').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(serverError(new Error()))
  })
})
