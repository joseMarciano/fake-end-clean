import { FakeDataModel } from '../../../../domain/usecases/fakeData/FakeDataModel'
import { AddFakeData } from '../../../../domain/usecases/fakeData/add/AddFakeData'
import { HttpRequest, Validator } from '../../../../presentation/protocols'
import { AddFakeDataController } from './AddFakeDataController'
import { badRequest, serverError } from '../../../../presentation/helper/httpHelper'

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

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidatorStub()
}

interface SutTypes {
  sut: AddFakeDataController
  addFakeDataStub: AddFakeData
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const addFakeDataStub = makeAddFakeData()
  const validatorStub = makeValidator()
  const sut = new AddFakeDataController(addFakeDataStub, validatorStub)

  return {
    sut,
    addFakeDataStub,
    validatorStub
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
