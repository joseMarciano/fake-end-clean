import { Resource } from '../../../../domain/model/Resource'
import { AddResourceModel } from '../../../../domain/usecases/resource/add/AddResource'
import { FindProjectByIdRepository } from '../../../../data/protocols/project/FindProjectByIdRepository'
import { ProjectModel } from '../../../../domain/usecases/project/find/ProjectModel'
import { AddResourceRepository } from '../../../../data/protocols/resource/AddResourceRepository'
import { DbAddResource } from './DbAddResource'
import { AddResourceError } from '../../../../domain/usecases/resource/validations/AddResourceError'
import { FindResourceByNameRepository } from '../../../../data/protocols/resource/FindResourceByNameRepository'

const makeFakeResourceModel = (): AddResourceModel => ({
  name: 'any_name',
  project: 'any_id'
})

const makeFakeResource = (): Resource => ({
  id: 'any_id',
  name: 'any_name',
  project: 'any_id',
  user: 'any_id'
})

const makeAddResourceRepository = (): AddResourceRepository => {
  class AddResourceRepositoryStub implements AddResourceRepository {
    async add (resourceModel: AddResourceModel): Promise<Resource> {
      return await Promise.resolve(makeFakeResource())
    }
  }

  return new AddResourceRepositoryStub()
}

const makeFindProjectByIdRepository = (): FindProjectByIdRepository => {
  class FindProjectByIdRepositoryStub implements FindProjectByIdRepository {
    async findById (_id: string): Promise<ProjectModel> {
      return await Promise.resolve({
        id: 'any_id',
        description: 'any_description',
        secretKey: 'any_secret_key',
        title: 'any_title'
      })
    }
  }

  return new FindProjectByIdRepositoryStub()
}
const makeFindResourceByNameRepository = (): FindResourceByNameRepository => {
  class FindResourceByNameRepositoryStub implements FindResourceByNameRepository {
    async findByName (_name: string): Promise<Resource> {
      return await Promise.resolve(null as any)
    }
  }

  return new FindResourceByNameRepositoryStub()
}
interface SutTypes {
  sut: DbAddResource
  findResourceByNameRepositoryStub: FindResourceByNameRepository
  addResourceRepositoryStub: AddResourceRepository
  findProjectByIdRepositoryStub: FindProjectByIdRepository
}
const makeSut = (): SutTypes => {
  const findResourceByNameRepositoryStub = makeFindResourceByNameRepository()
  const addResourceRepositoryStub = makeAddResourceRepository()
  const findProjectByIdRepositoryStub = makeFindProjectByIdRepository()
  const sut = new DbAddResource(addResourceRepositoryStub, findResourceByNameRepositoryStub, findProjectByIdRepositoryStub)

  return {
    sut,
    findResourceByNameRepositoryStub,
    addResourceRepositoryStub,
    findProjectByIdRepositoryStub
  }
}

describe('DbAddResource usecase', () => {
  test('Should call AddResourceRepository with correct values', async () => {
    const { sut, addResourceRepositoryStub } = makeSut()

    const addResourceSpy = jest.spyOn(addResourceRepositoryStub, 'add')

    await sut.add(makeFakeResourceModel())

    expect(addResourceSpy).toHaveBeenCalledWith({
      ...makeFakeResourceModel()
    })
  })

  test('Should throws if AddResourceRepository throws', async () => {
    const { sut, addResourceRepositoryStub } = makeSut()

    jest.spyOn(addResourceRepositoryStub, 'add').mockRejectedValueOnce(new Error())

    const promise = sut.add(makeFakeResourceModel())

    await expect(promise).rejects.toThrowError()
  })

  test('Should return Resource on AddResourceRepository success', async () => {
    const { sut } = makeSut()
    const user = await sut.add(makeFakeResourceModel())
    expect(user).toEqual(makeFakeResource())
  })

  test('Should call FindProjectByIdRepository with correct values', async () => {
    const { sut, findProjectByIdRepositoryStub } = makeSut()

    const findResourceByEmailSpy = jest.spyOn(findProjectByIdRepositoryStub, 'findById')

    await sut.add(makeFakeResourceModel())

    expect(findResourceByEmailSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should call FindResourceByNameRepository with correct values', async () => {
    const { sut, findResourceByNameRepositoryStub } = makeSut()

    const findResourceByNameSpy = jest.spyOn(findResourceByNameRepositoryStub, 'findByName')

    await sut.add(makeFakeResourceModel())

    expect(findResourceByNameSpy).toHaveBeenCalledWith('any_name')
  })

  test('Should return AddResourceError if FindResourceByNameRepository returns a Resource', async () => {
    const { sut, findResourceByNameRepositoryStub } = makeSut()

    jest.spyOn(findResourceByNameRepositoryStub, 'findByName').mockResolvedValueOnce(makeFakeResource())
    const error = await sut.add(makeFakeResourceModel())

    expect(error).toEqual(new AddResourceError('Resource name already exists'))
  })

  test('Should return AddResourceError if FindProjectByIdRepostory returns null', async () => {
    const { sut, findProjectByIdRepositoryStub } = makeSut()

    jest.spyOn(findProjectByIdRepositoryStub, 'findById').mockResolvedValueOnce(null as any)
    const error = await sut.add(makeFakeResourceModel())

    expect(error).toEqual(new AddResourceError('Project not found'))
  })
})
