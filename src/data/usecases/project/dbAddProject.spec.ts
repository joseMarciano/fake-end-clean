import { User } from '../../../domain/model/User'
import { FindUserByIdRepository } from '../../../data/protocols/user/FindUserByIdRepository'
import { DbAddProject } from './DbAddProject'
import { AddProjectModel } from '../../../domain/usecases/project/add/AddProject'

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
})
