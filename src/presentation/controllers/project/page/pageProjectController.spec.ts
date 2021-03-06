import { HttpRequest } from '../../../../presentation/protocols'
import { PageProjectController } from './PageProjectController'
import { PageProject } from '../../../../domain/usecases/project/find/PageProject'
import { Page, Pageable } from '../../../../domain/usecases/commons/Page'
import { ok, serverError } from '../../../../presentation/helper/httpHelper'
import { Project } from '../../../../domain/model/Project'

const makeFakeHttpRequest = (): HttpRequest => ({
  params: {
    offset: 0,
    limit: 20
  }
})
const makeFakeProject = (): Project => ({
  id: 'any_id',
  description: 'any_description',
  secretKey: 'any_secret_key',
  title: 'any_title',
  user: 'any_user'
})
const makeFakePageProject = (): Page<Project> => ({
  offset: 0,
  hasNext: false,
  total: 30,
  limit: 20,
  content: [makeFakeProject()]
})

const makePageProject = (): PageProject => {
  class PageProjectStub implements PageProject {
    async page (_pageable: Pageable): Promise<Page<Project>> {
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

  test('Should return 500 if PageProject throws', async () => {
    const { sut, dbPageProjectStub } = makeSut()

    jest.spyOn(dbPageProjectStub, 'page').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if PageProject succeeds', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok(makeFakePageProject()))
  })
})
