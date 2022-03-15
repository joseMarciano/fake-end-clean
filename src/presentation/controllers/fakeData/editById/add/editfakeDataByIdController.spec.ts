import { serverError, badRequest } from '../../../../../presentation/helper/httpHelper'
import { EditFakeData } from '../../../../../domain/usecases/fakeData/edit/EditFakeData'
import { FakeDataModel } from '../../../../../domain/usecases/fakeData/FakeDataModel'
import { HttpRequest, Validator } from '../../../../protocols'
import { EditFakeDataController } from './EditFakeDataByIdController'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    data: 'any_data',
    otherField: 'any_field'
  }
})

const makeFakeDataModel = (): FakeDataModel => ({
  id: 'any_id'
})

const makeEditFakeData = (): EditFakeData => {
  class EditFakeDataStub implements EditFakeData {
    async edit (_data: FakeDataModel): Promise<FakeDataModel> {
      return await Promise.resolve(makeFakeDataModel())
    }
  }

  return new EditFakeDataStub()
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
  sut: EditFakeDataController
  editFakeDataStub: EditFakeData
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const editFakeDataStub = makeEditFakeData()
  const validatorStub = makeValidator()
  const sut = new EditFakeDataController(editFakeDataStub, validatorStub)

  return {
    sut,
    editFakeDataStub,
    validatorStub
  }
}

describe('EditFakeDataController', () => {
  test('Should call EditFakeData with correct values ', async () => {
    const { sut, editFakeDataStub } = makeSut()

    const editSpy = jest.spyOn(editFakeDataStub, 'edit')
    await sut.handle(makeFakeHttpRequest())

    expect(editSpy).toHaveBeenCalledWith(makeFakeHttpRequest().body)
  })

  test('Should return FakeDataModel on EditFakeData success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse.statusCode).toEqual(200)
    expect(httpResponse.body).toEqual(makeFakeDataModel())
  })

  test('Should return 500 on EditFakeData throws', async () => {
    const { sut, editFakeDataStub } = makeSut()

    jest.spyOn(editFakeDataStub, 'edit').mockImplementationOnce(() => { throw new Error() })
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
