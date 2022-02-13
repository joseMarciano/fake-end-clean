import { noContent, serverError } from '../../../../presentation/helper/httpHelper'
import { User } from '../../../../domain/model/User'
import { ActivateUserByEmail } from '../../../../domain/usecases/user/activate/ActivateUserByEmail'
import { HttpRequest } from '../../../../presentation/protocols'
import { ActiveUserController } from './ActiveUserController'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'

const makeFakeHttpRequest = (): HttpRequest => ({
  params: {
    user: 'any_token'
  }
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

const makeActivateUserByEmail = (): ActivateUserByEmail => {
  class ActivateUserByEmailStub implements ActivateUserByEmail {
    async activeByEmail (_email: string): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new ActivateUserByEmailStub()
}

interface SutTypes {
  sut: ActiveUserController
  activeUserByEmailStub: ActivateUserByEmail
  decrypterStub: Decrypter
  findUserByIdStub: FindUserByEmailRepository
}

const makeSut = (): SutTypes => {
  const findUserByIdStub = makeFindUserByEmailRepository()
  const activeUserByEmailStub = makeActivateUserByEmail()
  const decrypterStub = makeDecrypter()
  const sut = new ActiveUserController(activeUserByEmailStub, decrypterStub)

  return {
    sut,
    activeUserByEmailStub,
    decrypterStub,
    findUserByIdStub
  }
}

describe('ActiveSignUpController', () => {
  test('Should call ActivateUserByEmail with correct values', async () => {
    const { sut, activeUserByEmailStub } = makeSut()

    const activeSpy = jest.spyOn(activeUserByEmailStub, 'activeByEmail')
    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(activeSpy).toHaveBeenCalledWith('any_email')
  })
  test('Should return 500 if ActivateUserByEmail throws', async () => {
    const { sut, activeUserByEmailStub } = makeSut()

    jest.spyOn(activeUserByEmailStub, 'activeByEmail').mockRejectedValueOnce(new Error())
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
  test('Should return 204 ActivateUserByEmail succeeds', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(noContent())
  })
})
