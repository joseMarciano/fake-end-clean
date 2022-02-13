import { ok, serverError } from '../../../../presentation/helper/httpHelper'
import { User } from '../../../../domain/model/User'
import { ActivateUser, ActivateUserModel } from '../../../../domain/usecases/user/activate/ActivateUser'
import { HttpRequest } from '../../../../presentation/protocols'
import { ActiveUserController } from './ActiveUserController'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'

const makeFakeHttpRequest = (): HttpRequest => ({
  params: {
    user: 'any_token'
  }
})

const makeActivateUserModel = (): ActivateUserModel => ({
  encryptedValue: 'any_token'
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
  findUserByIdStub: FindUserByEmailRepository
}

const makeSut = (): SutTypes => {
  const findUserByIdStub = makeFindUserByEmailRepository()
  const activeUserStub = makeActivateUserByEmail()
  const sut = new ActiveUserController(activeUserStub)

  return {
    sut,
    activeUserStub,
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
