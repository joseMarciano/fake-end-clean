import { HttpRequest, Validator } from '../../../protocols'
import { Resource } from '../../../../domain/model/Resource'
import { FindResourcesByProjectIdController } from './FindResourcesByProjectIdController'
import { FindResourcesByProjectId } from '../../../../domain/usecases/resource/findByProjectId/FindResourcesByProjectId'
import { ok, serverError, badRequest } from '../../../../presentation/helper/httpHelper'

const makeFakeHttpRequest = (): HttpRequest => ({
  paths: {
    projectId: 'any_id'
  }
})

const makeFakeResourceModel = (): Resource => ({
  id: 'any_id',
  name: 'any_name',
  project: 'any_project',
  user: 'any_user'
})

const makeFindResourcesByProjectId = (): FindResourcesByProjectId => {
  class FindResourcesByProjectIdStub implements FindResourcesByProjectId {
    async findByProjectId (_id: string): Promise<Resource[]> {
      return await Promise.resolve([makeFakeResourceModel()])
    }
  }

  return new FindResourcesByProjectIdStub()
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
  sut: FindResourcesByProjectIdController
  findResourceByProjectIdStub: FindResourcesByProjectId
  validationStub: Validator
}
const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const findResourceByProjectIdStub = makeFindResourcesByProjectId()
  const sut = new FindResourcesByProjectIdController(findResourceByProjectIdStub, validationStub)

  return {
    sut,
    findResourceByProjectIdStub,
    validationStub
  }
}

describe('FindResourcesByProjectId', () => {
  test('Should call FindResourcesByProjectId', async () => {
    const { sut, findResourceByProjectIdStub } = makeSut()

    const findByIdSpy = jest.spyOn(findResourceByProjectIdStub, 'findByProjectId')

    await sut.handle(makeFakeHttpRequest())

    expect(findByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return an 200 on FindResourcesByProjectId success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(ok([makeFakeResourceModel()]))
  })

  test('Should return 500 on FindResourcesByProjectId throws', async () => {
    const { sut, findResourceByProjectIdStub } = makeSut()

    jest.spyOn(findResourceByProjectIdStub, 'findByProjectId').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(serverError(new Error()))
  })

  test('Should call Validator with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeHttpRequest())

    expect(validateSpy).toHaveBeenCalledWith(makeFakeHttpRequest())
  })

  test('Should return 400 if Validator returns an Error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(badRequest(new Error()))
  })

  test('Should return 500 if Validator throws', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(serverError(new Error()))
  })
})
