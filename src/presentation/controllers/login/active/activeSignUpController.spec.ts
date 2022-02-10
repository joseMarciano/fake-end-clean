import { serverError } from '../../../../presentation/helper/httpHelper'
import { User } from '../../../../domain/model/User'
import { ActivateUser } from '../../../../domain/usecases/user/activate/ActivateUser'
import { HttpRequest } from '../../../../presentation/protocols'
import { ActiveUserController } from './ActiveUserController'

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
}

const makeSut = (): SutTypes => {
  const activeUserStub = makeActiveUser()
  const sut = new ActiveUserController(activeUserStub)

  return {
    sut,
    activeUserStub
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

    await expect(httpResponse).toEqual(serverError(new Error()))
  })
})
