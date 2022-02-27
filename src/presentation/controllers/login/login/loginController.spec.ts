import { LoginUser, LoginUserModel, AccessToken } from '../../../../domain/usecases/user/authentication/LoginUser'
import { HttpRequest, Validator } from '../../../../presentation/protocols'
import { LoginController } from './LoginController'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email',
    password: 'any_password'
  }
})

const makeHttpValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidatorStub()
}

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
  validatorStub: Validator

}
const makeSut = (): SutTypes => {
  const validatorStub = makeHttpValidator()
  const dbLoginUserStub = makeDbLoginUser()
  const sut = new LoginController(dbLoginUserStub, validatorStub)

  return {
    sut,
    dbLoginUserStub,
    validatorStub
  }
}

describe('LoginController', () => {
  test('Should call DbLoginUser with correct values', async () => {
    const { sut, dbLoginUserStub } = makeSut()

    const loginSpy = jest.spyOn(dbLoginUserStub, 'login')
    await sut.handle(makeFakeHttpRequest())

    expect(loginSpy).toHaveBeenCalledWith(makeFakeHttpRequest().body)
  })

  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()

    const validatorSpy = jest.spyOn(validatorStub, 'validate')
    await sut.handle(makeFakeHttpRequest())

    expect(validatorSpy).toHaveBeenCalledWith(makeFakeHttpRequest())
  })
})
