import { serverError, badRequest } from '../../../helper/httpHelper'
import { FakeDataModel } from '../../../../domain/usecases/fakeData/FakeDataModel'
import { HttpRequest, Validator } from '../../../protocols'
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

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidatorStub()
}

interface SutTypes {
  sut: FindAllFakeDataController
  findAllFakeDataStub: FindAllFakeData
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const findAllFakeDataStub = makeFindAllFakeData()
  const validatorStub = makeValidator()
  const sut = new FindAllFakeDataController(findAllFakeDataStub, validatorStub)

  return {
    sut,
    findAllFakeDataStub,
    validatorStub
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
