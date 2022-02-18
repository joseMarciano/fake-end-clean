import { AddProject, AddProjectModel } from '../../../../domain/usecases/project/add/AddProject'
import { ok } from '../../../../presentation/helper/httpHelper'
import { Project } from '../../../../domain/model/Project'
import { HttpRequest } from '../../../../presentation/protocols'
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

interface SutTypes {
  sut: AddProjectController
  addProjectStub: AddProject
}

const makeSut = (): SutTypes => {
  const addProjectStub = makeAddProject()
  const sut = new AddProjectController(addProjectStub)

  return {
    sut,
    addProjectStub
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
})
