import { badRequest, ok, serverError } from '../../../helper/httpHelper'
import { HttpRequest, Validator } from '../../../protocols'
import { EditProjectController } from './EditProjectController'
import { Project } from '../../../../domain/model/Project'
import { EditProject } from '../../../../domain/usecases/project/edit/EditProject'

const makeFakeHttpRequest = (): HttpRequest => ({
  paths: {
    id: 'any_id'
  },
  body: makeFakeProject()
})

const makeFakeProject = (): Project => ({
  id: 'any_id',
  description: 'any_decription',
  secretKey: 'any_secretKey',
  title: 'any_title',
  user: 'any_user_id'
})

const makeEditProject = (): EditProject => {
  class EditProjectStub implements EditProject {
    async edit (_project: Project): Promise<Project> {
      return await Promise.resolve(makeFakeProject())
    }
  }

  return new EditProjectStub()
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
  sut: EditProjectController
  editProjectStub: EditProject
  validtionStub: Validator
}
const makeSut = (): SutTypes => {
  const validtionStub = makeValidation()
  const editProjectStub = makeEditProject()
  const sut = new EditProjectController(editProjectStub, validtionStub)

  return {
    sut,
    editProjectStub,
    validtionStub
  }
}

describe('EditProject', () => {
  test('Should call EditProject', async () => {
    const { sut, editProjectStub } = makeSut()

    const editSpy = jest.spyOn(editProjectStub, 'edit')
    await sut.handle(makeFakeHttpRequest())

    expect(editSpy).toHaveBeenCalledWith(makeFakeProject())
  })

  test('Should return an 200 on EditProject success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(ok(makeFakeProject()))
  })

  test('Should return 500 on EditProject throws', async () => {
    const { sut, editProjectStub } = makeSut()

    jest.spyOn(editProjectStub, 'edit').mockImplementationOnce(() => { throw new Error() })
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
