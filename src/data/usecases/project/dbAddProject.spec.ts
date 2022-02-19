import { User } from '../../../domain/model/User'
import { FindUserByIdRepository } from '../../../data/protocols/user/FindUserByIdRepository'
import { DbAddProject } from './DbAddProject'
import { AddProjectModel } from '../../../domain/usecases/project/add/AddProject'
import { UserNotFoundError } from '../../../domain/usecases/user/validations/UserNotFoundError'
import { Project } from '../../../domain/model/Project'
import { AddProjectRepository } from '../../../data/protocols/project/AddProjectRepository'

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

const makeFakeProject = (): Project => ({
  id: 'any_id',
  secretKey: 'any_secretKey',
  description: 'any_description',
  title: 'any_title',
  user: 'any_userId'
})

const makeAddProjectRepository = (): AddProjectRepository => {
  class AddProjectRepositoryStub implements AddProjectRepository {
    async addProject (_projectModel: AddProjectModel): Promise<Project> {
      return await Promise.resolve(makeFakeProject())
    }
  }
  return new AddProjectRepositoryStub()
}

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
  addProjectRepositoryStub: AddProjectRepository
}
const makeSut = (): SutTypes => {
  const addProjectRepositoryStub = makeAddProjectRepository()
  const findUserByIdRepositoryStub = makeFindUserByIdStub()
  const sut = new DbAddProject(findUserByIdRepositoryStub, addProjectRepositoryStub)

  return {
    sut,
    findUserByIdRepositoryStub,
    addProjectRepositoryStub
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

  test('Should call AddProjectRepository with correct values', async () => {
    const { sut, addProjectRepositoryStub } = makeSut()

    const addProjectStub = jest.spyOn(addProjectRepositoryStub, 'addProject')
    await sut.add(makeFakeProjectModel())

    expect(addProjectStub).toHaveBeenCalledWith(makeFakeProjectModel())
  })
})
