import { badRequest, ok, serverError } from '../../../../presentation/helper/httpHelper'
import { FindProjectById } from '../../../../domain/usecases/project/find/FindProjectById'
import { HttpRequest, Validator } from '../../../../presentation/protocols'
import { FindProjectByIdController } from './FindProjectByIdController'
import { Project } from '../../../../domain/model/Project'

const makeFakeHttpRequest = (): HttpRequest => ({
  paths: {
    id: 'any_id'
  }
})

const makeFakeProjectModel = (): Project => ({
  id: 'any_id',
  description: 'any_decription',
  secretKey: 'any_secretKey',
  title: 'any_title',
  user: 'any_user'
})

const makeFindProjectById = (): FindProjectById => {
  class FindProjectByIdStub implements FindProjectById {
    async findById (_id: string): Promise<Project> {
      return await Promise.resolve(makeFakeProjectModel())
    }
  }

  return new FindProjectByIdStub()
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
  sut: FindProjectByIdController
  findProjectByIdStub: FindProjectById
  validtionStub: Validator
}
const makeSut = (): SutTypes => {
  const validtionStub = makeValidation()
  const findProjectByIdStub = makeFindProjectById()
  const sut = new FindProjectByIdController(findProjectByIdStub, validtionStub)

  return {
    sut,
    findProjectByIdStub,
    validtionStub
  }
}

describe('FindProjectById', () => {
  test('Should call FindProjectById', async () => {
    const { sut, findProjectByIdStub } = makeSut()

    const findByIdSpy = jest.spyOn(findProjectByIdStub, 'findById')

    await sut.handle(makeFakeHttpRequest())

    expect(findByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return an 200 on FindProjectById success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(ok(makeFakeProjectModel()))
  })

  test('Should return 500 on FindProjectById throws', async () => {
    const { sut, findProjectByIdStub } = makeSut()

    jest.spyOn(findProjectByIdStub, 'findById').mockImplementationOnce(() => { throw new Error() })
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
