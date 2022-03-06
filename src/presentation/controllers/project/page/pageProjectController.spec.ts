import { HttpRequest } from '../../../../presentation/protocols'
import { ProjectModel } from '../../../../domain/usecases/project/find/ProjectModel'
import { PageProjectController } from './PageProjectController'
import { PageProject } from '../../../../domain/usecases/project/find/PageProject'
import { Page, Pageable } from '../../../../domain/usecases/commons/Page'

const makeFakeHttpRequest = (): HttpRequest => ({
  params: {
    offset: 0,
    limit: 20
  }
})
const makeFakeProject = (): ProjectModel => ({
  id: 'any_id',
  description: 'any_description',
  secretKey: 'any_secret_key',
  title: 'any_title'
})
const makeFakePageProject = (): Page<ProjectModel> => ({
  offset: 0,
  limit: 20,
  content: [makeFakeProject()]
})

const makePageProject = (): PageProject => {
  class PageProjectStub implements PageProject {
    async page (_pageable: Pageable): Promise<Page<ProjectModel>> {
      return await Promise.resolve(makeFakePageProject())
    }
  }

  return new PageProjectStub()
}

interface SutTypes {
  sut: PageProjectController
  dbPageProjectStub: PageProject
}

const makeSut = (): SutTypes => {
  const dbPageProjectStub = makePageProject()
  const sut = new PageProjectController(dbPageProjectStub)

  return {
    sut,
    dbPageProjectStub
  }
}

describe('PageProjectController', () => {
  test('Should call dbPageProject with correct values', async () => {
    const { sut, dbPageProjectStub } = makeSut()
    const pageSpy = jest.spyOn(dbPageProjectStub, 'page')
    await sut.handle(makeFakeHttpRequest())
    expect(pageSpy).toHaveBeenCalledWith({ offset: 0, limit: 20 })
  })

  test('Should call dbPageProject with default values if no params is provided', async () => {
    const { sut, dbPageProjectStub } = makeSut()
    const pageSpy = jest.spyOn(dbPageProjectStub, 'page')
    await sut.handle({})
    expect(pageSpy).toHaveBeenCalledWith({ offset: 0, limit: 20 })
  })
})
