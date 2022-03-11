import { DeleteResourceById } from '../../../../domain/usecases/resource/remove/DeleteResourceById'
import { badRequest, noContent, serverError } from '../../../helper/httpHelper'
import { HttpRequest, Validator } from '../../../protocols'
import { DeleteResourceByIdController } from './DeleteResourceByIdController'

const makeFakeHttpRequest = (): HttpRequest => ({
  paths: {
    id: 'any_id'
  }
})

const makeDeleteResourceById = (): DeleteResourceById => {
  class DeleteResourceByIdStub implements DeleteResourceById {
    async deleteById (_id: string): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new DeleteResourceByIdStub()
}

const makeValidation = (): Validator => {
  class ValidatorStub implements Validator {
    validate (_input: any): Error | null {
      return null
    };
  }

  return new ValidatorStub()
}
interface SutTypes {
  sut: DeleteResourceByIdController
  deleteResourceByIdStub: DeleteResourceById
  validtionStub: Validator
}
const makeSut = (): SutTypes => {
  const validtionStub = makeValidation()
  const deleteResourceByIdStub = makeDeleteResourceById()
  const sut = new DeleteResourceByIdController(deleteResourceByIdStub, validtionStub)

  return {
    sut,
    deleteResourceByIdStub,
    validtionStub
  }
}

describe('DeleteResourceByIdController', () => {
  test('Should call DeleteResourceById', async () => {
    const { sut, deleteResourceByIdStub } = makeSut()

    const deleteByIdSpy = jest.spyOn(deleteResourceByIdStub, 'deleteById')
    await sut.handle(makeFakeHttpRequest())

    expect(deleteByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return an 204 on DeleteResourceById success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response).toEqual(noContent())
  })

  test('Should return 500 on DeleteResourceById throws', async () => {
    const { sut, deleteResourceByIdStub } = makeSut()

    jest.spyOn(deleteResourceByIdStub, 'deleteById').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(serverError(new Error()))
  })

  test('Should call Validator with correct values', async () => {
    const { sut, validtionStub } = makeSut()

    const validateSpy = jest.spyOn(validtionStub, 'validate')
    await sut.handle(makeFakeHttpRequest())

    expect(validateSpy).toHaveBeenCalledWith(makeFakeHttpRequest())
  })

  test('Should return 400 if Validator returns an Error', async () => {
    const { sut, validtionStub } = makeSut()

    jest.spyOn(validtionStub, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(badRequest(new Error()))
  })

  test('Should return 500 if Validator throws', async () => {
    const { sut, validtionStub } = makeSut()

    jest.spyOn(validtionStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(serverError(new Error()))
  })
})
