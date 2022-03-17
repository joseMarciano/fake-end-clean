import { serverError, ok, unauthorized } from '../../../../presentation/helper/httpHelper'
import { UpdateUserAccessToken } from '../../../../domain/usecases/user/authentication/UpdateUserAccessToken'
import { HttpRequest } from '../../../../presentation/protocols'
import { UpdateUserAccessTokenController } from './UpdateUserAccessTokenController'
import { UpdateAccessTokenError } from '../../../../domain/usecases/user/validations/UpdateAccessTokenError'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    refreshToken: 'any_refresh'
  }
})

const makeUpdateUserAccessToken = (): UpdateUserAccessToken => {
  class UpdateUserAccessTokenStub implements UpdateUserAccessToken {
    async updateUserAccessToken (_refreshToken: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }

  return new UpdateUserAccessTokenStub()
}

interface SutTypes {
  sut: UpdateUserAccessTokenController
  dbUpdateUserAccessTokenStub: UpdateUserAccessToken
}

const makeSut = (): SutTypes => {
  const dbUpdateUserAccessTokenStub = makeUpdateUserAccessToken()
  const sut = new UpdateUserAccessTokenController(dbUpdateUserAccessTokenStub)
  return {
    sut,
    dbUpdateUserAccessTokenStub
  }
}

describe('UpdateUserAccessTokenController', () => {
  test('Should call DbUpdateUserAccessToken with correct value', async () => {
    const { sut, dbUpdateUserAccessTokenStub } = makeSut()
    const updateUserAccessSpy = jest.spyOn(dbUpdateUserAccessTokenStub, 'updateUserAccessToken')
    await sut.handle(makeFakeHttpRequest())
    expect(updateUserAccessSpy).toHaveBeenCalledWith('any_refresh')
  })

  test('Should return 500 if DbUpdateUserAccessToken throws', async () => {
    const { sut, dbUpdateUserAccessTokenStub } = makeSut()
    jest.spyOn(dbUpdateUserAccessTokenStub, 'updateUserAccessToken').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 401 if DbUpdateUserAccessToken returns UpdateUserAccessError', async () => {
    const { sut, dbUpdateUserAccessTokenStub } = makeSut()
    jest.spyOn(dbUpdateUserAccessTokenStub, 'updateUserAccessToken').mockResolvedValueOnce(new UpdateAccessTokenError())
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(unauthorized(new UpdateAccessTokenError()))
  })

  test('Should return 200 if DbUpdateUserAccessToken succeeds', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})
