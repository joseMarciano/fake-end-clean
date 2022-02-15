import { badRequest, forbiden, ok, serverError } from '../../../../presentation/helper/httpHelper'
import { User } from '../../../../domain/model/User'
import { ActivateUser, ActivateUserModel } from '../../../../domain/usecases/user/activate/ActivateUser'
import { HttpRequest, Validator } from '../../../../presentation/protocols'
import { ActiveUserController } from './ActiveUserController'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { ActivateUserError } from '../../../../domain/usecases/user/validations/ActivateUserError'

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

const makeHttpValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidatorStub()
}

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
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const validatorStub = makeHttpValidator()
  const findUserByIdStub = makeFindUserByEmailRepository()
  const activeUserStub = makeActivateUserByEmail()
  const sut = new ActiveUserController(activeUserStub, validatorStub)

  return {
    sut,
    activeUserStub,
    findUserByIdStub,
    validatorStub
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
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()

    const validatorSpy = jest.spyOn(validatorStub, 'validate')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(validatorSpy).toHaveBeenCalledWith({ user: 'any_token' })
  })
  test('Should return 500 if ActivateUser throws', async () => {
    const { sut, activeUserStub } = makeSut()

    jest.spyOn(activeUserStub, 'active').mockRejectedValueOnce(new Error())
    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 500 if Validate throws', async () => {
    const { sut, validatorStub } = makeSut()

    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 400 if Validate return an Error', async () => {
    const { sut, validatorStub } = makeSut()

    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new Error()))
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

  test('Should return 403 if ActivateUser return an ActivateUserError', async () => {
    const { sut, activeUserStub } = makeSut()

    jest.spyOn(activeUserStub, 'active').mockResolvedValueOnce(new ActivateUserError())
    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(forbiden(new ActivateUserError()))
  })
})
