import { EmailInUseError } from '../../../../domain/usecases/user/validations/EmailInUseError'
import { AddUser, UserModel } from '../../../../domain/usecases/user/add/AddUser'
import { User } from '../../../../domain/model/User'
import { badRequest, noContent, serverError } from '../../../helper/httpHelper'
import { HttpRequest, Validator } from '../../../protocols'
import { SignUpController } from './SignUpController'
import { Notification } from '../../../../data/notification/Notification'
import { Authentication, AuthenticationModel } from '../../../../domain/usecases/user/authentication/Authentication'

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
}

const makeAddUser = (): AddUser => {
  class AddUserStub implements AddUser {
    async add (user: UserModel): Promise<User> {
      return await Promise.resolve({
        id: 'any_id',
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        isActive: true
      })
    }
  }

  return new AddUserStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (_authenticationMode: AuthenticationModel): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }

  return new AuthenticationStub()
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (_input: any): Error | null {
      return null
    }
  }

  return new ValidatorStub()
}

const makeNotification = (): Notification => {
  class NotificationStub implements Notification {
    async send (input: any): Promise<void> {
      await Promise.resolve({})
    }
  }

  return new NotificationStub()
}
interface SutTypes {
  sut: SignUpController
  addUserStub: AddUser
  validatorStub: Validator
  notificationStub: Notification
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validatorStub = makeValidatorStub()
  const addUserStub = makeAddUser()
  const notificationStub = makeNotification()
  const sut = new SignUpController(addUserStub, validatorStub, notificationStub, authenticationStub)

  return {
    sut,
    addUserStub,
    validatorStub,
    notificationStub,
    authenticationStub
  }
}

describe('SignUpController', () => {
  test('Should call Validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()

    const validatorSpy = jest.spyOn(validatorStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validatorSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return badRequest if Validators returns an error', async () => {
    const { sut, validatorStub } = makeSut()

    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should return 500 if Validators throws', async () => {
    const { sut, validatorStub } = makeSut()

    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call AddUser with correct values', async () => {
    const { sut, addUserStub } = makeSut()

    const addUserSpy = jest.spyOn(addUserStub, 'add')

    await sut.handle(makeFakeRequest())

    expect(addUserSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      isActive: false
    })
  })

  test('Should return 500 if AddUser throws', async () => {
    const { sut, addUserStub } = makeSut()

    jest.spyOn(addUserStub, 'add').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 if SignUpController success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 400 if AddUser returns EmailInUseError', async () => {
    const { sut, addUserStub } = makeSut()

    jest.spyOn(addUserStub, 'add').mockResolvedValueOnce(new EmailInUseError('any_email@mail.com'))
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new EmailInUseError('any_email@mail.com')))
  })

  test('Should call Notification with correct values', async () => {
    const { sut, notificationStub } = makeSut()

    const sendSpy = jest.spyOn(notificationStub, 'send')
    await sut.handle(makeFakeRequest())

    expect(sendSpy).toHaveBeenCalledWith({
      to: 'any_email@mail.com',
      subject: 'Welcome to fake end ✔',
      html: '<a target="_blank" href="http://localhost:8080/active">Click here to activate your account</a>'
    })
  })

  test('Should return 500 if Notification throws', async () => {
    const { sut, notificationStub } = makeSut()

    jest.spyOn(notificationStub, 'send').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())

    expect(authSpy).toHaveBeenCalledWith({
      id: 'any_id',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
