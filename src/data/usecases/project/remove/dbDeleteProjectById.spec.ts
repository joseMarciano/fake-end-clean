import { DeleteProjectByIdRepository } from '../../../../data/protocols/project/DeleteProjectByIdRepository'
import { DbDeleteProjectById } from './DbDeleteProjectById'

const makeDeleteProjectByIdRepositoryStub = (): DeleteProjectByIdRepository => {
  class DeleteProjectByIdRepositoryStub implements DeleteProjectByIdRepository {
    async deleteById (_id: string): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new DeleteProjectByIdRepositoryStub()
}

interface SutTypes {
  sut: DbDeleteProjectById
  deleteProjectByIdRepositoryStub: DeleteProjectByIdRepository
}
const makeSut = (): SutTypes => {
  const deleteProjectByIdRepositoryStub = makeDeleteProjectByIdRepositoryStub()
  const sut = new DbDeleteProjectById(deleteProjectByIdRepositoryStub)

  return {
    sut,
    deleteProjectByIdRepositoryStub
  }
}

describe('DeleteProjectById', () => {
  test('Should call DeleteProjectByIdRepository with correct value', async () => {
    const { sut, deleteProjectByIdRepositoryStub } = makeSut()

    const deleteByIdSpy = jest.spyOn(deleteProjectByIdRepositoryStub, 'deleteById')
    await sut.deleteById('any_id')

    expect(deleteByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if DeleteProjectByIdRepository throws', async () => {
    const { sut, deleteProjectByIdRepositoryStub } = makeSut()

    jest.spyOn(deleteProjectByIdRepositoryStub, 'deleteById').mockImplementationOnce(() => { throw new Error() })
    const result = sut.deleteById('any_id')

    await expect(result).rejects.toThrow()
  })
})
