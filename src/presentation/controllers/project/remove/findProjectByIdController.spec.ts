import { badRequest, noContent, serverError } from '../../../../presentation/helper/httpHelper'
import { DeleteProjectById } from '../../../../domain/usecases/project/remove/DeleteProjectById'
import { HttpRequest, Validator } from '../../../../presentation/protocols'
import { DeleteProjectByIdController } from './DeleteProjectByIdController'

const makeFakeHttpRequest = (): HttpRequest => ({
  paths: {
    id: 'any_id'
  }
})

const makeDeleteProjectById = (): DeleteProjectById => {
  class DeleteProjectByIdStub implements DeleteProjectById {
    async deleteById (_id: string): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new DeleteProjectByIdStub()
}

const makeValidation = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error | null {
      return null
    };
  }

  return new ValidatorStub()
}
interface SutTypes {
  sut: DeleteProjectByIdController
  deleteProjectByIdStub: DeleteProjectById
  validtionStub: Validator
}
const makeSut = (): SutTypes => {
  const validtionStub = makeValidation()
  const deleteProjectByIdStub = makeDeleteProjectById()
  const sut = new DeleteProjectByIdController(deleteProjectByIdStub, validtionStub)

  return {
    sut,
    deleteProjectByIdStub,
    validtionStub
  }
}

describe('DeleteProjectByIdController', () => {
  test('Should call DeleteProjectById', async () => {
    const { sut, deleteProjectByIdStub } = makeSut()

    const deleteByIdSpy = jest.spyOn(deleteProjectByIdStub, 'deleteById')

    await sut.handle(makeFakeHttpRequest())

    expect(deleteByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return an 204 on DeleteProjectById success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(noContent())
  })

  test('Should return 500 on DeleteProjectById throws', async () => {
    const { sut, deleteProjectByIdStub } = makeSut()

    jest.spyOn(deleteProjectByIdStub, 'deleteById').mockImplementationOnce(() => { throw new Error() })
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
