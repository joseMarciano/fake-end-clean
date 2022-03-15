import { PageFakeDataRepository } from 'src/data/protocols/fakeData/PageFakeDataRepository'
import { FakeData } from 'src/domain/model/FakeData'
import { Page, Pageable } from '../../../../domain/usecases/commons/Page'
import { DbPageFakeData } from './DbPageFakeData'

const makeFakePageFakeData = (): Page<FakeData> => ({
  offset: 0,
  total: 30,
  hasNext: false,
  limit: 20,
  content: [makeFakeData()]
})

const makeFakeData = (): FakeData => ({
  id: 'any_id',
  project: 'any_project',
  resource: 'any_resource',
  content: {
    data: 'any_data',
    otherField: 'any_field'
  }
})

const makeProjectRepository = (): PageFakeDataRepository => {
  class PageFakeDataRepositoryStub implements PageFakeDataRepository {
    async page (_pageable: Pageable): Promise<Page<FakeData>> {
      return await Promise.resolve(makeFakePageFakeData())
    }
  }

  return new PageFakeDataRepositoryStub()
}

interface SutTypes {
  sut: DbPageFakeData
  pageFakeDataRepositoryStub: PageFakeDataRepository
}

const makeSut = (): SutTypes => {
  const pageFakeDataRepositoryStub = makeProjectRepository()
  const sut = new DbPageFakeData(pageFakeDataRepositoryStub)

  return {
    sut,
    pageFakeDataRepositoryStub
  }
}

describe('DbPageFakeData', () => {
  test('Should call PageFakeDataRepository with correct values', async () => {
    const { sut, pageFakeDataRepositoryStub } = makeSut()
    const pageSpy = jest.spyOn(pageFakeDataRepositoryStub, 'page')
    await sut.page({ offset: 0, limit: 20 })
    expect(pageSpy).toHaveBeenCalledWith({ offset: 0, limit: 20 })
  })

  test('Should return Page of FakeDataModel on success', async () => {
    const { sut } = makeSut()
    const page = await sut.page({ offset: 0, limit: 20 })
    expect(page).toEqual({
      ...makeFakePageFakeData(),
      content: [{
        id: 'any_id',
        data: 'any_data',
        otherField: 'any_field'
      }]
    })
  })

  test('Should throws if PageFakeDataRepository throws', async () => {
    const { sut, pageFakeDataRepositoryStub } = makeSut()
    jest.spyOn(pageFakeDataRepositoryStub, 'page').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.page({ offset: 0, limit: 20 })
    await expect(promise).rejects.toThrow()
  })
})
