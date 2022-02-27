import { badRequest, serverError } from '../../../../presentation/helper/httpHelper'
import { LoginUser, LoginUserModel, AccessToken } from '../../../../domain/usecases/user/authentication/LoginUser'
import { HttpRequest, Validator } from '../../../../presentation/protocols'
import { LoginController } from './LoginController'
import { LoginUserError } from '../../../../domain/usecases/user/validations/LoginUserError'

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

  test('Should return 500 if LoginUser throws', async () => {
    const { sut, dbLoginUserStub } = makeSut()

    jest.spyOn(dbLoginUserStub, 'login').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 500 if Validator throws', async () => {
    const { sut, validatorStub } = makeSut()

    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 400 if Validator retuns an Error', async () => {
    const { sut, validatorStub } = makeSut()

    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should return 400 if LoginUser retuns an LoginUserError', async () => {
    const { sut, dbLoginUserStub } = makeSut()

    jest.spyOn(dbLoginUserStub, 'login').mockResolvedValueOnce(new LoginUserError('any_message'))
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(badRequest(new LoginUserError('any_message')))
  })
})
