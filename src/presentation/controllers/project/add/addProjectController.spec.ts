import { AddProject, AddProjectModel } from '../../../../domain/usecases/project/add/AddProject'
import { badRequest, ok, serverError } from '../../../../presentation/helper/httpHelper'
import { Project } from '../../../../domain/model/Project'
import { HttpRequest, Validator } from '../../../../presentation/protocols'
import { AddProjectController } from './AddProjectController'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    title: 'any_title',
    description: 'any_description'
  },
  params: {
    userId: 'any_id'
  }
})

const makeFakeProject = (): Project => ({
  id: 'any_id',
  title: 'any_title',
  description: 'any_description',
  secretKey: 'any_secret_key',
  user: 'any_id'
})

const makeAddProject = (): AddProject => {
  class AddProjectStub implements AddProject {
    async add (userModel: AddProjectModel): Promise<Project> {
      return makeFakeProject()
    }
  }

  return new AddProjectStub()
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
  sut: AddProjectController
  addProjectStub: AddProject
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator()
  const addProjectStub = makeAddProject()
  const sut = new AddProjectController(addProjectStub, validatorStub)

  return {
    sut,
    addProjectStub,
    validatorStub
  }
}

describe('AddProjectController', () => {
  test('Should call AddProject with correct values ', async () => {
    const { sut, addProjectStub } = makeSut()

    const addSpy = jest.spyOn(addProjectStub, 'add')
    await sut.handle(makeFakeHttpRequest())

    expect(addSpy).toHaveBeenCalledWith({
      ...makeFakeHttpRequest().body,
      ...makeFakeHttpRequest().params
    })
  })

  test('Should return an 200 on AddProject success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(ok(makeFakeProject()))
  })

  test('Should return 500 on AddProject fails', async () => {
    const { sut, addProjectStub } = makeSut()

    jest.spyOn(addProjectStub, 'add').mockImplementationOnce(() => { throw new Error() })
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
