import { User } from '../../../../domain/model/User'
import { ActivateUser } from '../../../../domain/usecases/user/activate/ActivateUser'
import { HttpRequest } from '../../../../presentation/protocols'
import { ActiveUserController } from './ActiveUserController'

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
    const httpRequest: HttpRequest = {
      params: {
        user: 'any_token'
      }
    }

    await sut.handle(httpRequest)

    expect(activeSpy).toHaveBeenCalledWith(makeFakeUser())
  })
})
