import { DbEditProject } from './DbEditProject'
import { AddProjectModel } from '../../../../domain/usecases/project/add/AddProject'
import { Project } from '../../../../domain/model/Project'
import { EditProjectRepository } from '../../../protocols/project/EditProjectRepository'

const makeFakeProject = (): Project => ({
  id: 'any_id',
  secretKey: 'any_secretKey',
  description: 'any_description',
  title: 'any_title',
  user: 'any_userId'
})

const makeFakeUpdatedProject = (): Project => ({
  ...makeFakeProject(),
  description: 'any_updated_description',
  title: 'any_updated_title'
})

const makeEditProjectRepository = (): EditProjectRepository => {
  class EditProjectRepositoryStub implements EditProjectRepository {
    async edit (_projectModel: AddProjectModel): Promise<Project> {
      return await Promise.resolve(makeFakeUpdatedProject())
    }
  }
  return new EditProjectRepositoryStub()
}

interface SutTypes {
  sut: DbEditProject
  editProjectRepositoryStub: EditProjectRepository
}
const makeSut = (): SutTypes => {
  const editProjectRepositoryStub = makeEditProjectRepository()
  const sut = new DbEditProject(editProjectRepositoryStub)

  return {
    sut,
    editProjectRepositoryStub
  }
}

describe('DbEditProject', () => {
  beforeAll(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date())
  })

  test('Should call EditProjectRepository with correct values', async () => {
    const { sut, editProjectRepositoryStub } = makeSut()

    const editProjectStub = jest.spyOn(editProjectRepositoryStub, 'edit')
    await sut.edit(makeFakeProject())

    expect(editProjectStub).toHaveBeenCalledWith(makeFakeProject())
  })

  test('Should throws if EditProjectRepository throws', async () => {
    const { sut, editProjectRepositoryStub } = makeSut()

    jest.spyOn(editProjectRepositoryStub, 'edit').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.edit(makeFakeProject())

    await expect(promise).rejects.toThrow()
  })

  test('Should return an updated Project on DbEditProject succeeds', async () => {
    const { sut } = makeSut()

    const project = await sut.edit(makeFakeProject())

    expect(project).toEqual(makeFakeUpdatedProject())
  })
})
