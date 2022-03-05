import { FindProjectByIdRepository } from '../../../../data/protocols/project/FindProjectByIdRepository'
import { ProjectModel } from '../../../../domain/usecases/project/find/ProjectModel'
import { DbFindProjectById } from './DbFindProjectById'

const makeFakeProjectModel = (): ProjectModel => ({
  id: 'any_id',
  description: 'any_decription',
  secretKey: 'any_secretKey',
  title: 'any_title'
})

const makeFindProjectByIdRepositoryStub = (): FindProjectByIdRepository => {
  class FindProjectByIdRepositoryStub implements FindProjectByIdRepository {
    async findById (id: string): Promise<ProjectModel> {
      return await Promise.resolve(makeFakeProjectModel())
    }
  }

  return new FindProjectByIdRepositoryStub()
}

interface SutTypes {
  sut: DbFindProjectById
  findProjectByIdRepositoryStub: FindProjectByIdRepository
}
const makeSut = (): SutTypes => {
  const findProjectByIdRepositoryStub = makeFindProjectByIdRepositoryStub()
  const sut = new DbFindProjectById(findProjectByIdRepositoryStub)

  return {
    sut,
    findProjectByIdRepositoryStub
  }
}

describe('DbFindProjectById', () => {
  test('Should call FindProjectByIdRepository with correct value', async () => {
    const { sut, findProjectByIdRepositoryStub } = makeSut()

    const findByIdSpy = jest.spyOn(findProjectByIdRepositoryStub, 'findById')
    await sut.findById('any_id')

    expect(findByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
