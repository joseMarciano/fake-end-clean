import { FindProjectById } from '../../../../domain/usecases/project/find/FindProjectById'
import { ProjectModel } from '../../../../domain/usecases/project/find/ProjectModel'
import { HttpRequest } from '../../../../presentation/protocols'
import { FindProjectByIdController } from './FindProjectByIdController'

const makeFakeHttpRequest = (): HttpRequest => ({
  paths: {
    id: 'any_id'
  }
})

const makeFindProjectById = (): FindProjectById => {
  class FindProjectByIdStub implements FindProjectById {
    async findById (_id: string): Promise<ProjectModel> {
      return await Promise.resolve({
        id: 'any_id',
        description: 'any_decription',
        secretKey: 'any_secretKey',
        title: 'any_title'
      })
    }
  }

  return new FindProjectByIdStub()
}
interface SutTypes {
  sut: FindProjectByIdController
  findProjectByIdStub: FindProjectById
}
const makeSut = (): SutTypes => {
  const findProjectByIdStub = makeFindProjectById()
  const sut = new FindProjectByIdController(findProjectByIdStub)

  return {
    sut,
    findProjectByIdStub
  }
}

describe('FindProjectById', () => {
  test('Should call FindProjectById', async () => {
    const { sut, findProjectByIdStub } = makeSut()

    const findByIdSpy = jest.spyOn(findProjectByIdStub, 'findById')

    await sut.handle(makeFakeHttpRequest())

    expect(findByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
