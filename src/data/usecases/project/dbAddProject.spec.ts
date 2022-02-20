import { User } from '../../../domain/model/User'
import { FindUserByIdRepository } from '../../../data/protocols/user/FindUserByIdRepository'
import { DbAddProject } from './DbAddProject'
import { AddProjectModel } from '../../../domain/usecases/project/add/AddProject'
import { UserNotFoundError } from '../../../domain/usecases/user/validations/UserNotFoundError'
import { Project } from '../../../domain/model/Project'
import { AddProjectRepository } from '../../../data/protocols/project/AddProjectRepository'
import { Encrypter } from 'src/data/protocols/cryptography/Encrypter'

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

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (_input: any): Promise<string> {
      return await Promise.resolve('any_encrypted')
    }
  }

  return new EncrypterStub()
}

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
  encrypterStub: Encrypter
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addProjectRepositoryStub = makeAddProjectRepository()
  const findUserByIdRepositoryStub = makeFindUserByIdStub()
  const sut = new DbAddProject(findUserByIdRepositoryStub, addProjectRepositoryStub, encrypterStub)

  return {
    sut,
    findUserByIdRepositoryStub,
    addProjectRepositoryStub,
    encrypterStub
  }
}

describe('DbAddProject', () => {
  beforeAll(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date())
  })

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

    expect(addProjectStub).toHaveBeenCalledWith({
      ...makeFakeProjectModel(),
      secretKey: 'any_encrypted'
    })
  })

  test('Should throws if AddProjectRepository throws', async () => {
    const { sut, addProjectRepositoryStub } = makeSut()

    jest.spyOn(addProjectRepositoryStub, 'addProject').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(makeFakeProjectModel())

    await expect(promise).rejects.toThrow()
  })

  test('Should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()

    const encrypSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(makeFakeProjectModel())

    expect(encrypSpy).toHaveBeenCalledWith({
      ...makeFakeProjectModel(),
      createdAt: new Date()
    })
  })

  test('Should throws if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(makeFakeProjectModel())

    await expect(promise).rejects.toThrow()
  })

  test('Should return an Project on DbAddProject succeeds', async () => {
    const { sut } = makeSut()

    const project = await sut.add(makeFakeProjectModel())

    expect(project).toEqual(makeFakeProject())
  })
})
