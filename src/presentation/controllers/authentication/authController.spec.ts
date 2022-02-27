import { noContent, serverError, unauthorized } from '../../../presentation/helper/httpHelper'
import { AuthByToken } from '../../../domain/usecases/user/authentication/AuthByToken'
import { HttpRequest } from '../../../presentation/protocols'
import { AuthController } from './AuthController'
import { User } from 'src/domain/model/User'

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

interface SutTypes {
  sut: AuthController
  authByTokenStub: AuthByToken
}
const makeSut = (): SutTypes => {
  const authByTokenStub = makeAuthByToken()
  const sut = new AuthController(authByTokenStub)

  return {
    sut,
    authByTokenStub
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
})
