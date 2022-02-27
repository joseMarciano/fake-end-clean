import { LoginUser, LoginUserModel, AccessToken } from '../../../../domain/usecases/user/authentication/LoginUser'
import { HttpRequest } from '../../../../presentation/protocols'
import { LoginController } from './LoginController'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email',
    password: 'any_password'
  }
})

const makeDbLoginUser = (): LoginUser => {
  class DbLoginUserStub implements LoginUser {
    async login (_loginUSerModel: LoginUserModel): Promise<AccessToken> {
      return await Promise.resolve({
        accessToken: 'any_accessToken',
        refreshToken: 'any_refreshToken'
      })
    }
  }

  return new DbLoginUserStub()
}

interface SutTypes {
  sut: LoginController
  dbLoginUserStub: LoginUser
}
const makeSut = (): SutTypes => {
  const dbLoginUserStub = makeDbLoginUser()
  const sut = new LoginController(dbLoginUserStub)

  return {
    sut,
    dbLoginUserStub
  }
}

describe('LoginController', () => {
  test('Should call DbLoginUser with correct values', async () => {
    const { sut, dbLoginUserStub } = makeSut()

    const loginSpy = jest.spyOn(dbLoginUserStub, 'login')

    await sut.handle(makeFakeHttpRequest())

    expect(loginSpy).toHaveBeenCalledWith(makeFakeHttpRequest().body)
  })
})
