import { serverError, badRequest } from '../../../helper/httpHelper'
import { HttpRequest, Validator } from '../../../protocols'
import { DeleteFakeDataById } from 'src/domain/usecases/fakeData/remove/DeleteFakeDataById'
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

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (_input: any): Error | null {
      return null
    }
  }

  return new ValidatorStub()
}

interface SutTypes {
  sut: DeleteFakeDataByIdController
  deleteFakeDataByIdStub: DeleteFakeDataById
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const deleteFakeDataByIdStub = makeDeleteFakeDataById()
  const validatorStub = makeValidator()
  const sut = new DeleteFakeDataByIdController(deleteFakeDataByIdStub, validatorStub)

  return {
    sut,
    deleteFakeDataByIdStub,
    validatorStub
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

  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()

    const validateSpy = jest.spyOn(validatorStub, 'validate')
    await sut.handle(makeFakeHttpRequest())

    expect(validateSpy).toHaveBeenCalledWith(makeFakeHttpRequest())
  })

  test('Should return 400 if Validator returns an Error', async () => {
    const { sut, validatorStub } = makeSut()

    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(badRequest(new Error()))
  })

  test('Should return 500 if Validator throws', async () => {
    const { sut, validatorStub } = makeSut()

    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(serverError(new Error()))
  })
})
