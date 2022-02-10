import { serverError } from '../../../../presentation/helper/httpHelper'
import { User } from '../../../../domain/model/User'
import { ActivateUser } from '../../../../domain/usecases/user/activate/ActivateUser'
import { HttpRequest } from '../../../../presentation/protocols'
import { ActiveUserController } from './ActiveUserController'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { FindUserById } from '../../../../domain/usecases/user/find/FindUserById'

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

const makeFindUserById = (): FindUserById => {
  class FindUserByIdStub implements FindUserById {
    async findById (_id: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }

  return new FindUserByIdStub()
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (_input: string): Promise<any> {
      return {
        id: 'any_id'
      }
    }
  }

  return new DecrypterStub()
}

const makeActiveUser = (): ActivateUser => {
  class ActiveUserStub implements ActivateUser {
    async active (_user: User): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new ActiveUserStub()
}

interface SutTypes {
  sut: ActiveUserController
  activeUserStub: ActivateUser
  decrypterStub: Decrypter
  findUserByIdStub: FindUserById
}

const makeSut = (): SutTypes => {
  const findUserByIdStub = makeFindUserById()
  const activeUserStub = makeActiveUser()
  const decrypterStub = makeDecrypter()
  const sut = new ActiveUserController(activeUserStub, decrypterStub, findUserByIdStub)

  return {
    sut,
    activeUserStub,
    decrypterStub,
    findUserByIdStub
  }
}

describe('ActiveSignUpController', () => {
  test('Should call ActiveUser with correct values', async () => {
    const { sut, activeUserStub } = makeSut()

    const activeSpy = jest.spyOn(activeUserStub, 'active')
    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(activeSpy).toHaveBeenCalledWith(makeFakeUser())
  })
  test('Should return 500 if ActiveUser throws', async () => {
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
  test('Should call FindUserById with correct values', async () => {
    const { sut, findUserByIdStub } = makeSut()

    const findUserByIdSpy = jest.spyOn(findUserByIdStub, 'findById')
    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(findUserByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return 500 if FindUserById throws', async () => {
    const { sut, findUserByIdStub } = makeSut()

    jest.spyOn(findUserByIdStub, 'findById').mockRejectedValueOnce(new Error())
    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
