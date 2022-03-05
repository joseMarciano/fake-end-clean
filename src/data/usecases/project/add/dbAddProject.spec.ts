import { DbAddProject } from './DbAddProject'
import { AddProjectModel } from '../../../../domain/usecases/project/add/AddProject'
import { Project } from '../../../../domain/model/Project'
import { AddProjectRepository } from '../../../protocols/project/AddProjectRepository'
import { Encrypter } from 'src/data/protocols/cryptography/Encrypter'

const makeFakeProjectModel = (): AddProjectModel => ({
  description: 'any_description',
  title: 'any_title'
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

interface SutTypes {
  sut: DbAddProject
  addProjectRepositoryStub: AddProjectRepository
  encrypterStub: Encrypter
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addProjectRepositoryStub = makeAddProjectRepository()
  const sut = new DbAddProject(addProjectRepositoryStub, encrypterStub)

  return {
    sut,
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
