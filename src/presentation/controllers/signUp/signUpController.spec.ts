import { User } from '../../../domain/model/User'
import { AddUser, UserModel } from '../../../domain/usecases/AddUser'
import { badRequest, ok, serverError } from '../../helper/httpHelper'
import { HttpRequest } from '../../protocols'
import { MissingParamError } from '../errors/MissingParamError'
import { SignUpController } from './SignUpController'

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
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
        password: 'any_password'
      })
    }
  }

  return new AddUserStub()
}

interface SutTypes {
  sut: SignUpController
  addUserStub: AddUser
}

const makeSut = (): SutTypes => {
  const addUserStub = makeAddUser()
  const sut = new SignUpController(addUserStub)

  return {
    sut,
    addUserStub
  }
}

describe('SignUpController', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()

    const fakeHttpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(fakeHttpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const fakeHttpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(fakeHttpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const fakeHttpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com'
      }
    }

    const httpResponse = await sut.handle(fakeHttpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call AddUser with correct values', async () => {
    const { sut, addUserStub } = makeSut()

    const addUserSpy = jest.spyOn(addUserStub, 'add')

    await sut.handle(makeFakeRequest())

    expect(addUserSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
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
      password: 'any_password'
    }))
  })
})
