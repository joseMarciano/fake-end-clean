import { DbFindResourcesByProjectId } from './DbFindResourcesByProjectId'
import { Resource } from '../../../../domain/model/Resource'
import { FindResourcesByProjectIdRepository } from '../../../../data/protocols/resource/FindResourceByProjectIdRepository'

const makeFakeResourceModel = (): Resource => ({
  id: 'any_id',
  name: 'any_name',
  project: 'any_project',
  user: 'any_user'
})

const makeFindResourcesByProjectIdRepositoryStub = (): FindResourcesByProjectIdRepository => {
  class FindResourcesByProjectIdRepositoryStub implements FindResourcesByProjectIdRepository {
    async findByProjectId (_id: string): Promise<Resource[]> {
      return await Promise.resolve([makeFakeResourceModel()])
    }
  }

  return new FindResourcesByProjectIdRepositoryStub()
}

interface SutTypes {
  sut: DbFindResourcesByProjectId
  findResourceByProjectIdRepositoryStub: FindResourcesByProjectIdRepository
}
const makeSut = (): SutTypes => {
  const findResourceByProjectIdRepositoryStub = makeFindResourcesByProjectIdRepositoryStub()
  const sut = new DbFindResourcesByProjectId(findResourceByProjectIdRepositoryStub)

  return {
    sut,
    findResourceByProjectIdRepositoryStub
  }
}

describe('DbFindResourcesByProjectId', () => {
  test('Should call FindResourcesByProjectIdRepository with correct value', async () => {
    const { sut, findResourceByProjectIdRepositoryStub } = makeSut()

    const findByProjectIdSpy = jest.spyOn(findResourceByProjectIdRepositoryStub, 'findByProjectId')
    await sut.findByProjectId('any_id')

    expect(findByProjectIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return empty array if projectId null', async () => {
    const { sut, findResourceByProjectIdRepositoryStub } = makeSut()

    jest.spyOn(findResourceByProjectIdRepositoryStub, 'findByProjectId').mockResolvedValueOnce([makeFakeResourceModel()])
    const resources = await sut.findByProjectId(null as any)

    expect(resources).toEqual([])
  })

  test('Should throw if FindResourcesByProjectIdRepository throws', async () => {
    const { sut, findResourceByProjectIdRepositoryStub } = makeSut()

    jest.spyOn(findResourceByProjectIdRepositoryStub, 'findByProjectId').mockImplementationOnce(() => { throw new Error() })
    const result = sut.findByProjectId('any_id')

    await expect(result).rejects.toThrow()
  })
})
