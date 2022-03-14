import { DbAddProject } from './DbAddProject'
import { AddProjectModel } from '../../../../domain/usecases/project/add/AddProject'
import { Project } from '../../../../domain/model/Project'
import { AddProjectRepository } from '../../../protocols/project/AddProjectRepository'
import { Encrypter } from '../../../../data/protocols/cryptography/Encrypter'
import { EditProjectRepository } from '../../../../data/protocols/project/EditProjectRepository'

const makeFakeProjectModel = (): AddProjectModel => ({
  description: 'any_description',
  title: 'any_title'
})

const makeFakeProject = (): Project => ({
  id: 'any_id',
  secretKey: '',
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

const makeEditProjectRepository = (): EditProjectRepository => {
  class EditProjectRepositoryStub implements EditProjectRepository {
    async edit (_project: Project): Promise<Project> {
      return await Promise.resolve({ ...makeFakeProject(), secretKey: 'any_secretKey' })
    }
  }
  return new EditProjectRepositoryStub()
}

interface SutTypes {
  sut: DbAddProject
  addProjectRepositoryStub: AddProjectRepository
  encrypterStub: Encrypter
  editProjectRepositoryStub: EditProjectRepository
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addProjectRepositoryStub = makeAddProjectRepository()
  const editProjectRepositoryStub = makeEditProjectRepository()
  const sut = new DbAddProject(addProjectRepositoryStub, encrypterStub, editProjectRepositoryStub)

  return {
    sut,
    addProjectRepositoryStub,
    encrypterStub,
    editProjectRepositoryStub
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
      secretKey: ''
    })
  })

  test('Should call EditProjectRepository with correct values', async () => {
    const { sut, editProjectRepositoryStub } = makeSut()

    const editProjectSpy = jest.spyOn(editProjectRepositoryStub, 'edit')
    await sut.add(makeFakeProjectModel())

    expect(editProjectSpy).toHaveBeenCalledWith({
      ...makeFakeProject(),
      secretKey: 'any_encrypted'
    })
  })

  test('Should throws if EditProjectRepository throws', async () => {
    const { sut, editProjectRepositoryStub } = makeSut()

    jest.spyOn(editProjectRepositoryStub, 'edit').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(makeFakeProjectModel())

    await expect(promise).rejects.toThrow()
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

    expect(encrypSpy).toHaveBeenCalledWith('any_id')
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

    expect(project).toEqual({
      ...makeFakeProject(),
      secretKey: 'any_secretKey'
    })
  })
})
