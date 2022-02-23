import { serverError } from '../../../presentation/helper/httpHelper'
import { AuthByToken } from '../../../domain/usecases/user/authentication/AuthByToken'
import { HttpRequest } from '../../../presentation/protocols'
import { AuthController } from './AuthController'

const makeFakeHttpRequest = (): HttpRequest => ({
  headers: {
    'user-access': 'any_token'
  }
})

const makeAuthByToken = (): AuthByToken => {
  class AuthByTokenStub implements AuthByToken {
    async authByToken (_token: string): Promise<boolean> {
      return await Promise.resolve(true)
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
})
