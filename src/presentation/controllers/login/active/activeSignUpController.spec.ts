import { ok, serverError } from '../../../../presentation/helper/httpHelper'
import { User } from '../../../../domain/model/User'
import { ActivateUser, ActivateUserModel } from '../../../../domain/usecases/user/activate/ActivateUser'
import { HttpRequest } from '../../../../presentation/protocols'
import { ActiveUserController } from './ActiveUserController'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'

const makeFakeHttpRequest = (): HttpRequest => ({
  params: {
    user: 'any_token'
  }
})

const makeActivateUserModel = (): ActivateUserModel => ({
  email: 'any_email'
})

const makeFakeUser = (): User => ({
  id: 'any_id',
  email: 'any_email',
  isActive: false,
  name: 'any_name',
  password: 'any_password'
})

const makeFindUserByEmailRepository = (): FindUserByEmailRepository => {
  class FindUserByEmailRepositoryStub implements FindUserByEmailRepository {
    async findByEmail (_email: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }

  return new FindUserByEmailRepositoryStub()
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (_input: string): Promise<any> {
      return {
        email: 'any_email'
      }
    }
  }

  return new DecrypterStub()
}

const makeActivateUserByEmail = (): ActivateUser => {
  class ActivateUserByEmailStub implements ActivateUser {
    async active (_data: ActivateUserModel): Promise<User> {
      return await Promise.resolve({
        ...makeFakeUser(),
        isActive: true
      })
    }
  }

  return new ActivateUserByEmailStub()
}

interface SutTypes {
  sut: ActiveUserController
  activeUserStub: ActivateUser
  decrypterStub: Decrypter
  findUserByIdStub: FindUserByEmailRepository
}

const makeSut = (): SutTypes => {
  const findUserByIdStub = makeFindUserByEmailRepository()
  const activeUserStub = makeActivateUserByEmail()
  const decrypterStub = makeDecrypter()
  const sut = new ActiveUserController(activeUserStub, decrypterStub)

  return {
    sut,
    activeUserStub,
    decrypterStub,
    findUserByIdStub
  }
}

describe('ActiveSignUpController', () => {
  test('Should call ActivateUser with correct values', async () => {
    const { sut, activeUserStub } = makeSut()

    const activeSpy = jest.spyOn(activeUserStub, 'active')
    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(activeSpy).toHaveBeenCalledWith(makeActivateUserModel())
  })
  test('Should return 500 if ActivateUser throws', async () => {
    const { sut, activeUserStub } = makeSut()

    jest.spyOn(activeUserStub, 'active').mockRejectedValueOnce(new Error())
    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
  test('Should return 500 if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 200 ActivateUser succeeds', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const userActive: User = {
      ...makeFakeUser(),
      isActive: true
    }
    expect(httpResponse).toEqual(ok(userActive))
  })
})
