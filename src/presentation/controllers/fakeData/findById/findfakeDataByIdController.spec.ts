import { serverError, badRequest } from '../../../helper/httpHelper'
import { FakeDataModel } from '../../../../domain/usecases/fakeData/FakeDataModel'
import { HttpRequest, Validator } from '../../../protocols'
import { FindFakeDataByIdController } from './FindFakeDataByIdController'
import { FindFakeDataById } from 'src/domain/usecases/fakeData/find/FindFakeDataById'

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

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidatorStub()
}

interface SutTypes {
  sut: FindFakeDataByIdController
  findFakeDataByIdStub: FindFakeDataById
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const findFakeDataByIdStub = makeFindFakeDataById()
  const validatorStub = makeValidator()
  const sut = new FindFakeDataByIdController(findFakeDataByIdStub, validatorStub)

  return {
    sut,
    findFakeDataByIdStub,
    validatorStub
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
