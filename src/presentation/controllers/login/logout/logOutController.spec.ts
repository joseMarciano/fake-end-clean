import { LogOutUser } from '../../../../domain/usecases/user/authentication/LogOutUser'
import { noContent, serverError } from '../../../helper/httpHelper'
import { HttpRequest } from '../../../protocols'
import { LogOutController } from './LogOutController'

const makeFakeHttpRequest = (): HttpRequest => ({
  headers: {
    authorization: 'any_token'
  }
})

const makeDbLogOutUser = (): LogOutUser => {
  class DbLogOutUserStub implements LogOutUser {
    async logout (_token: string): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new DbLogOutUserStub()
}

interface SutTypes {
  sut: LogOutController
  dbLogOutUserStub: LogOutUser

}
const makeSut = (): SutTypes => {
  const dbLogOutUserStub = makeDbLogOutUser()
  const sut = new LogOutController(dbLogOutUserStub)

  return {
    sut,
    dbLogOutUserStub
  }
}

describe('LogOutController', () => {
  test('Should call DbLogOutUser with correct values', async () => {
    const { sut, dbLogOutUserStub } = makeSut()

    const logoutSpy = jest.spyOn(dbLogOutUserStub, 'logout')
    await sut.handle(makeFakeHttpRequest())

    expect(logoutSpy).toHaveBeenCalledWith(makeFakeHttpRequest().headers.authorization)
  })

  test('Should return 500 if LogOutUser throws', async () => {
    const { sut, dbLogOutUserStub } = makeSut()

    jest.spyOn(dbLogOutUserStub, 'logout').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on LogOutController succeeds', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
