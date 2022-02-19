import { User } from '../../../domain/model/User'
import { FindUserByIdRepository } from '../../../data/protocols/user/FindUserByIdRepository'
import { DbAddProject } from './DbAddProject'
import { AddProjectModel } from '../../../domain/usecases/project/add/AddProject'
import { UserNotFoundError } from '../../../domain/usecases/user/validations/UserNotFoundError'

const makeFakeUser = (): User => ({
  id: 'any_id',
  email: 'any_email',
  isActive: true,
  name: 'any_name',
  password: 'any_password'
})

const makeFakeProjectModel = (): AddProjectModel => ({
  description: 'any_description',
  title: 'any_title',
  userId: 'any_userId'
})

const makeFindUserByIdStub = (): FindUserByIdRepository => {
  class FindUserByIdRepositoryStub implements FindUserByIdRepository {
    async findById (_id: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }

  return new FindUserByIdRepositoryStub()
}

interface SutTypes {
  sut: DbAddProject
  findUserByIdRepositoryStub: FindUserByIdRepository
}
const makeSut = (): SutTypes => {
  const findUserByIdRepositoryStub = makeFindUserByIdStub()
  const sut = new DbAddProject(findUserByIdRepositoryStub)

  return {
    sut,
    findUserByIdRepositoryStub
  }
}

describe('DbAddProject', () => {
  test('Should call findUserByIdRepository with correct value', async () => {
    const { sut, findUserByIdRepositoryStub } = makeSut()

    const findByIdSpy = jest.spyOn(findUserByIdRepositoryStub, 'findById')
    await sut.add(makeFakeProjectModel())

    expect(findByIdSpy).toHaveBeenCalledWith('any_userId')
  })

  test('Should throws if FindUserByIdRepository throws', async () => {
    const { sut, findUserByIdRepositoryStub } = makeSut()

    jest.spyOn(findUserByIdRepositoryStub, 'findById').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(makeFakeProjectModel())

    await expect(promise).rejects.toThrow()
  })

  test('Should return UserNotFoundError if FindUserByIdRepository fails', async () => {
    const { sut, findUserByIdRepositoryStub } = makeSut()

    jest.spyOn(findUserByIdRepositoryStub, 'findById').mockResolvedValueOnce(null as any)
    const error = await sut.add(makeFakeProjectModel())

    expect(error).toEqual(new UserNotFoundError('User any_userId not found'))
  })
})
