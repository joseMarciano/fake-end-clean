import { Project } from '../../../../domain/model/Project'
import { PageProjectRepository } from '../../../../data/protocols/project/PageProjectRepository'
import { Page, Pageable } from '../../../../domain/usecases/commons/Page'
import { DbPageProject } from './DbPageProject'

const makeFakeProject = (): Project => ({
  id: 'any_id',
  description: 'any_description',
  secretKey: 'any_secret_key',
  title: 'any_title',
  user: 'any_user'
})
const makeFakePageProject = (): Page<Project> => ({
  offset: 0,
  total: 30,
  hasNext: false,
  limit: 20,
  content: [makeFakeProject()]
})

const makeProjectRepository = (): PageProjectRepository => {
  class PageProjectRepositoryStub implements PageProjectRepository {
    async page (pageable: Pageable): Promise<Page<Project>> {
      return await Promise.resolve(makeFakePageProject())
    }
  }

  return new PageProjectRepositoryStub()
}

interface SutTypes {
  sut: DbPageProject
  pageProjectRepositoryStub: PageProjectRepository
}

const makeSut = (): SutTypes => {
  const pageProjectRepositoryStub = makeProjectRepository()
  const sut = new DbPageProject(pageProjectRepositoryStub)

  return {
    sut,
    pageProjectRepositoryStub
  }
}

describe('DbPageProject', () => {
  test('Should call PageProjectRepository with correct values', async () => {
    const { sut, pageProjectRepositoryStub } = makeSut()
    const pageSpy = jest.spyOn(pageProjectRepositoryStub, 'page')
    await sut.page({ offset: 0, limit: 20 })
    expect(pageSpy).toHaveBeenCalledWith({ offset: 0, limit: 20 })
  })

  test('Should return Page of Project model on success', async () => {
    const { sut } = makeSut()
    const page = await sut.page({ offset: 0, limit: 20 })
    expect(page).toEqual(makeFakePageProject())
  })

  test('Should throws if PageProjectRepository throws', async () => {
    const { sut, pageProjectRepositoryStub } = makeSut()
    jest.spyOn(pageProjectRepositoryStub, 'page').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.page({ offset: 0, limit: 20 })
    await expect(promise).rejects.toThrow()
  })
})
