import { noContent, serverError, unauthorized } from '../../../presentation/helper/httpHelper'
import { AuthByToken } from '../../../domain/usecases/user/authentication/AuthByToken'
import { HttpRequest } from '../../../presentation/protocols'
import { AuthController } from './AuthController'
import { User } from '../../../domain/model/User'
import { SetUserContext } from '../../../data/protocols/application/UserContext'

const makeFakeHttpRequest = (): HttpRequest => ({
  headers: {
    authorization: 'any_token'
  }
})

const makeFakeUser = (): User => ({
  id: 'any_id',
  email: 'any_email',
  isActive: false,
  name: 'any_name',
  password: 'any_password'
})

const makeAuthByToken = (): AuthByToken => {
  class AuthByTokenStub implements AuthByToken {
    async authByToken (_token: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }

  return new AuthByTokenStub()
}

const makeSetUserContext = (): SetUserContext => {
  class SetUserContextStub implements SetUserContext {
    async setUser (_user: User): Promise<void> {
      await Promise.resolve(_user)
    }
  }

  return new SetUserContextStub()
}

interface SutTypes {
  sut: AuthController
  authByTokenStub: AuthByToken
  setUserContextStub: SetUserContext
}
const makeSut = (): SutTypes => {
  const setUserContextStub = makeSetUserContext()
  const authByTokenStub = makeAuthByToken()
  const sut = new AuthController(authByTokenStub, setUserContextStub)

  return {
    sut,
    authByTokenStub,
    setUserContextStub
  }
}

describe('Authentication', () => {
  test('Should call AuthByToken with correct values', async () => {
    const { sut, authByTokenStub } = makeSut()

    const authByTokenSpy = jest.spyOn(authByTokenStub, 'authByToken')
    await sut.handle(makeFakeHttpRequest())

    expect(authByTokenSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return 500 if AuthByToken throws', async () => {
    const { sut, authByTokenStub } = makeSut()

    jest.spyOn(authByTokenStub, 'authByToken').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 401 if AuthByToken retuns null', async () => {
    const { sut, authByTokenStub } = makeSut()

    jest.spyOn(authByTokenStub, 'authByToken').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 204 if AuthByToken retuns User', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(noContent())
  })

  test('Should call SetUserContext with correct values', async () => {
    const { sut, setUserContextStub } = makeSut()

    const setUserSpy = jest.spyOn(setUserContextStub, 'setUser')

    await sut.handle(makeFakeHttpRequest())

    expect(setUserSpy).toHaveBeenCalledWith(makeFakeUser())
  })
})
