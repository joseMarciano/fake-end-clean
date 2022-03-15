import { HttpRequest } from '../../../protocols'
import { ProjectModel } from '../../../../domain/usecases/project/find/ProjectModel'
import { PageFakeDataController } from './PageFakeDataController'
import { Page, Pageable } from '../../../../domain/usecases/commons/Page'
import { ok, serverError } from '../../../helper/httpHelper'
import { PageFakeData } from '../../../../domain/usecases/fakeData/find/PageFakeData'

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
const makeFakePageFakeData = (): Page<ProjectModel> => ({
  offset: 0,
  hasNext: false,
  total: 30,
  limit: 20,
  content: [makeFakeProject()]
})

const makePageFakeData = (): PageFakeData => {
  class PageFakeDataStub implements PageFakeData {
    async page (_pageable: Pageable): Promise<Page<ProjectModel>> {
      return await Promise.resolve(makeFakePageFakeData())
    }
  }

  return new PageFakeDataStub()
}

interface SutTypes {
  sut: PageFakeDataController
  dbPageFakeDataStub: PageFakeData
}

const makeSut = (): SutTypes => {
  const dbPageFakeDataStub = makePageFakeData()
  const sut = new PageFakeDataController(dbPageFakeDataStub)

  return {
    sut,
    dbPageFakeDataStub
  }
}

describe('PageFakeDataController', () => {
  test('Should call DbPageFakeData with correct values', async () => {
    const { sut, dbPageFakeDataStub } = makeSut()
    const pageSpy = jest.spyOn(dbPageFakeDataStub, 'page')
    await sut.handle(makeFakeHttpRequest())
    expect(pageSpy).toHaveBeenCalledWith({ offset: 0, limit: 20 })
  })

  test('Should call DbPageFakeData with default values if no params is provided', async () => {
    const { sut, dbPageFakeDataStub } = makeSut()
    const pageSpy = jest.spyOn(dbPageFakeDataStub, 'page')
    await sut.handle({})
    expect(pageSpy).toHaveBeenCalledWith({ offset: 0, limit: 20 })
  })

  test('Should return 500 if PageFakeData throws', async () => {
    const { sut, dbPageFakeDataStub } = makeSut()

    jest.spyOn(dbPageFakeDataStub, 'page').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if PageFakeData succeeds', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok(makeFakePageFakeData()))
  })
})
