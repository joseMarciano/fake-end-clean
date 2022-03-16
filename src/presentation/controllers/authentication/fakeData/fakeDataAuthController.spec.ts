import { FakeContext, SetFakeContext } from '../../../../data/protocols/application/fakeData/ApplicationContextFake'
import { SetUserContext } from '../../../../data/protocols/application/UserContext'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { FindProjectByIdRepository } from '../../../../data/protocols/project/FindProjectByIdRepository'
import { FindResourceByNameAndProjectIdRepository } from '../../../../data/protocols/resource/FindResourceByNameAndProjectIdRepository'
import { FindUserByIdRepository } from '../../../../data/protocols/user/FindUserByIdRepository'
import { Project } from '../../../../domain/model/Project'
import { Resource } from '../../../../domain/model/Resource'
import { User } from '../../../../domain/model/User'
import { badRequest, noContent, serverError, unauthorized } from '../../../../presentation/helper/httpHelper'
import { HttpRequest } from '../../../../presentation/protocols'
import { FakeDataAuthController } from './FakeDataAuthController'

const makeFakeHttpRequest = (): HttpRequest => ({
  headers: {
    authorization: 'any_token'
  },
  url: '/any/9984'
})

const makeFakeUser = (): User => ({
  id: 'any_id',
  email: 'any_email',
  isActive: false,
  name: 'any_name',
  password: 'any_password'
})

const makeFakeProject = (): Project => ({
  id: 'any_id',
  description: 'any_decription',
  secretKey: 'any_secretKey',
  title: 'any_title',
  user: 'any_user'
})

const makeFakeResource = (): Resource => ({
  id: 'any_id',
  name: 'any',
  project: 'any_id',
  user: 'any_id'
})

const makeSetUserContext = (): SetUserContext => {
  class SetUserContextStub implements SetUserContext {
    async setUser (_user: User): Promise<void> {
      await Promise.resolve(_user)
    }
  }

  return new SetUserContextStub()
}

const makeSetFakeContext = (): SetFakeContext => {
  class SetFakeContextStub implements SetFakeContext {
    async setFakeContext (_fakeContext: FakeContext): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new SetFakeContextStub()
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (input: string): Promise<any> {
      return await Promise.resolve('any_id')
    }
  }

  return new DecrypterStub()
}

const makeFindProjectByIdRepositoryStub = (): FindProjectByIdRepository => {
  class FindProjectByIdRepositoryStub implements FindProjectByIdRepository {
    async findById (id: string): Promise<Project> {
      return await Promise.resolve(makeFakeProject())
    }
  }

  return new FindProjectByIdRepositoryStub()
}

const makeFindUserByIdRepository = (): FindUserByIdRepository => {
  class FindUserByEmailRepository implements FindUserByIdRepository {
    async findById (id: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }

  return new FindUserByEmailRepository()
}

const makeFindResourceByNameAndProjectIdRepository = (): FindResourceByNameAndProjectIdRepository => {
  class FindResourceByNameAndProjectIdRepositoryStub implements FindResourceByNameAndProjectIdRepository {
    async findByNameAndProjectId (filter: any): Promise<Resource> {
      return await Promise.resolve(makeFakeResource())
    }
  }

  return new FindResourceByNameAndProjectIdRepositoryStub()
}

interface SutTypes {
  sut: FakeDataAuthController
  setUserContextStub: SetUserContext
  setFakeContextStub: SetFakeContext
  decrypterStub: Decrypter
  findProjectByIdRepositoryStub: FindProjectByIdRepository
  findUserByIdRepositoryStub: FindUserByIdRepository
  findResourceByNameAndProjectIdRepositoryStub: FindResourceByNameAndProjectIdRepository
}
const makeSut = (): SutTypes => {
  const setUserContextStub = makeSetUserContext()
  const setFakeContextStub = makeSetFakeContext()
  const decrypterStub = makeDecrypter()
  const findProjectByIdRepositoryStub = makeFindProjectByIdRepositoryStub()
  const findUserByIdRepositoryStub = makeFindUserByIdRepository()
  const findResourceByNameAndProjectIdRepositoryStub = makeFindResourceByNameAndProjectIdRepository()
  const sut = new FakeDataAuthController(
    setUserContextStub,
    setFakeContextStub,
    decrypterStub,
    findProjectByIdRepositoryStub,
    findUserByIdRepositoryStub,
    findResourceByNameAndProjectIdRepositoryStub)

  return {
    sut,
    setUserContextStub,
    setFakeContextStub,
    decrypterStub,
    findProjectByIdRepositoryStub,
    findUserByIdRepositoryStub,
    findResourceByNameAndProjectIdRepositoryStub
  }
}

describe('FakeDataAuthController', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.handle(makeFakeHttpRequest())

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should call SetUserContext with correct value', async () => {
    const { sut, setUserContextStub } = makeSut()

    const setUserSpy = jest.spyOn(setUserContextStub, 'setUser')
    await sut.handle(makeFakeHttpRequest())

    expect(setUserSpy).toHaveBeenCalledWith(makeFakeUser())
  })

  test('Should call SetFakeContext with correct value', async () => {
    const { sut, setFakeContextStub } = makeSut()

    const setFakeContextSpy = jest.spyOn(setFakeContextStub, 'setFakeContext')
    await sut.handle(makeFakeHttpRequest())

    expect(setFakeContextSpy).toHaveBeenCalledWith({
      resource: makeFakeResource(),
      project: makeFakeProject()
    })
  })

  test('Should return 500 if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should call FindProjectByIdRepository with correct value', async () => {
    const { sut, findProjectByIdRepositoryStub } = makeSut()

    const findByIdSpy = jest.spyOn(findProjectByIdRepositoryStub, 'findById')
    await sut.handle(makeFakeHttpRequest())

    expect(findByIdSpy).toHaveBeenCalledWith('any_id', false)
  })

  test('Should return 500 if FindProjectByIdRepository throws', async () => {
    const { sut, findProjectByIdRepositoryStub } = makeSut()

    jest.spyOn(findProjectByIdRepositoryStub, 'findById').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 400 if FindProjectByIdRepository returns null', async () => {
    const { sut, findProjectByIdRepositoryStub } = makeSut()

    jest.spyOn(findProjectByIdRepositoryStub, 'findById').mockResolvedValueOnce(null as any)
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(badRequest(new Error('Project not found')))
  })

  test('Should call FindUserByIdRepository with correct value', async () => {
    const { sut, findUserByIdRepositoryStub } = makeSut()

    const findByIdSpy = jest.spyOn(findUserByIdRepositoryStub, 'findById')
    await sut.handle(makeFakeHttpRequest())

    expect(findByIdSpy).toHaveBeenCalledWith('any_user')
  })

  test('Should return 500 if FindUserByIdRepository throws', async () => {
    const { sut, findUserByIdRepositoryStub } = makeSut()

    jest.spyOn(findUserByIdRepositoryStub, 'findById').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 400 if FindUserByIdRepository returns null', async () => {
    const { sut, findUserByIdRepositoryStub } = makeSut()

    jest.spyOn(findUserByIdRepositoryStub, 'findById').mockResolvedValueOnce(null as any)
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(badRequest(new Error('User not found')))
  })

  test('Should return 400 if HttpRequest.url not match', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ ...makeFakeHttpRequest(), url: '@we1eda' })
    expect(httpResponse).toEqual(badRequest(new Error('Resource not found')))
  })

  test('Should call FindResourceByNameAndProjectIdRepository with correct values', async () => {
    const { sut, findResourceByNameAndProjectIdRepositoryStub } = makeSut()
    const findResourceByNameSpy = jest.spyOn(findResourceByNameAndProjectIdRepositoryStub, 'findByNameAndProjectId')
    await sut.handle(makeFakeHttpRequest())
    expect(findResourceByNameSpy).toHaveBeenCalledWith({ name: 'any', projectId: 'any_id' })
  })

  test('Should return 400 FindResourceByNameAndProjectIdRepository returns null', async () => {
    const { sut, findResourceByNameAndProjectIdRepositoryStub } = makeSut()
    jest.spyOn(findResourceByNameAndProjectIdRepositoryStub, 'findByNameAndProjectId').mockResolvedValueOnce(null as any)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new Error('Resource not found')))
  })

  test('Should return 204 if FakeDataAuthController succeeds', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
