import { badRequest, ok, serverError } from '../../../helper/httpHelper'
import { Resource } from '../../../../domain/model/Resource'
import { HttpRequest, Validator } from '../../../protocols'
import { AddResourceController } from './AddResourceController'
import { AddResource, AddResourceModel } from '../../../../domain/usecases/resource/add/AddResource'
import { AddResourceError } from '../../../../domain/usecases/resource/validations/AddResourceError'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_title'
  },
  paths: {
    projectId: 'any_project_id'
  }
})

const makeFakeResource = (): Resource => ({
  id: 'any_id',
  name: 'any_name',
  project: 'any_project',
  user: 'any_user'
})

const makeAddResource = (): AddResource => {
  class AddResourceStub implements AddResource {
    async add (resourceModel: AddResourceModel): Promise<Resource> {
      return makeFakeResource()
    }
  }

  return new AddResourceStub()
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
  sut: AddResourceController
  addResourceStub: AddResource
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator()
  const addResourceStub = makeAddResource()
  const sut = new AddResourceController(addResourceStub, validatorStub)

  return {
    sut,
    addResourceStub,
    validatorStub
  }
}

describe('AddResourceController', () => {
  test('Should call AddResource with correct values ', async () => {
    const { sut, addResourceStub } = makeSut()

    const addSpy = jest.spyOn(addResourceStub, 'add')
    await sut.handle(makeFakeHttpRequest())

    expect(addSpy).toHaveBeenCalledWith({
      ...makeFakeHttpRequest().body,
      project: makeFakeHttpRequest().paths.projectId
    })
  })

  test('Should return an 200 on AddResource success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(ok(makeFakeResource()))
  })

  test('Should return 500 on AddResource throws', async () => {
    const { sut, addResourceStub } = makeSut()

    jest.spyOn(addResourceStub, 'add').mockImplementationOnce(() => { throw new Error() })
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

  test('Should return 400 if AddResource returns an Error', async () => {
    const { sut, addResourceStub } = makeSut()

    jest.spyOn(addResourceStub, 'add').mockResolvedValueOnce(new AddResourceError())
    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(badRequest(new AddResourceError()))
  })

  test('Should return 500 if Validator throws', async () => {
    const { sut, validatorStub } = makeSut()

    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(serverError(new Error()))
  })
})
