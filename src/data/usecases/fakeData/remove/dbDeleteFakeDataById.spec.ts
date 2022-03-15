import { DeleteFakeDataByIdRepository } from '../../../../data/protocols/fakeData/DeleteFakeDataByIdRepository'
import { DbDeleteFakeDataById } from './DbDeleteFakeDataById'

const makeDeleteFakeDataByIdRepositoryStub = (): DeleteFakeDataByIdRepository => {
  class DeleteFakeDataByIdRepositoryStub implements DeleteFakeDataByIdRepository {
    async deleteById (_id: string): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new DeleteFakeDataByIdRepositoryStub()
}

interface SutTypes {
  sut: DbDeleteFakeDataById
  deleteFakeDataByIdRepositoryStub: DeleteFakeDataByIdRepository
}
const makeSut = (): SutTypes => {
  const deleteFakeDataByIdRepositoryStub = makeDeleteFakeDataByIdRepositoryStub()
  const sut = new DbDeleteFakeDataById(deleteFakeDataByIdRepositoryStub)

  return {
    sut,
    deleteFakeDataByIdRepositoryStub
  }
}

describe('DeleteProjectById', () => {
  test('Should call DeleteFakeDataByIdRepository with correct value', async () => {
    const { sut, deleteFakeDataByIdRepositoryStub } = makeSut()

    const deleteByIdSpy = jest.spyOn(deleteFakeDataByIdRepositoryStub, 'deleteById')
    await sut.deleteById('any_id')

    expect(deleteByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if DeleteFakeDataByIdRepository throws', async () => {
    const { sut, deleteFakeDataByIdRepositoryStub } = makeSut()

    jest.spyOn(deleteFakeDataByIdRepositoryStub, 'deleteById').mockImplementationOnce(() => { throw new Error() })
    const result = sut.deleteById('any_id')

    await expect(result).rejects.toThrow()
  })
})
