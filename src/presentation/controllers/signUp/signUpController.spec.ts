import { Validator } from '../../../presentation/protocols'
import { User } from '../../../domain/model/User'
import { AddUser, UserModel } from '../../../domain/usecases/user/AddUser'
import { badRequest, ok, serverError } from '../../helper/httpHelper'
import { HttpRequest } from '../../protocols'
import { SignUpController } from './SignUpController'

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

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (_input: any): Error | null {
      return null
    }
  }

  return new ValidatorStub()
}

interface SutTypes {
  sut: SignUpController
  addUserStub: AddUser
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const addUserStub = makeAddUser()
  const sut = new SignUpController(addUserStub, validatorStub)

  return {
    sut,
    addUserStub,
    validatorStub
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

  test('Should return 200 if AddUser success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({
      id: 'any_id',
      email: 'any_email@mail.com',
      name: 'any_name',
      password: 'any_password',
      isActive: true
    }))
  })
})
