import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { User, UserAccessToken } from '../../../../domain/model/User'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { DbAuthByToken } from './DbAuthByToken'
import { FindUserAccessRepository } from '../../../../data/protocols/user/FindUserAccessRepository'

const makeFakeUser = (): User => ({
  id: 'any_id',
  email: 'any_email',
  isActive: true,
  name: 'any_name',
  password: 'any_password'
})

const makeFakeUserAccessToken = (): UserAccessToken => ({
  id: 'any_id',
  accessToken: 'any_access_token',
  createdAt: new Date(),
  userId: 'any_id'
})

const makeFindUSerAccessRepository = (): FindUserAccessRepository => {
  class FindUserAccessRepositoryStub implements FindUserAccessRepository {
    async findUserAccess (_userId: string, _accessToken: string): Promise<UserAccessToken> {
      return makeFakeUserAccessToken()
    }
  }

  return new FindUserAccessRepositoryStub()
}
const makeFindUserByEmail = (): FindUserByEmailRepository => {
  class FindUserByEmailRepositoryStub implements FindUserByEmailRepository {
    async findByEmail (email: string): Promise<User> {
      return makeFakeUser()
    }
  }

  return new FindUserByEmailRepositoryStub()
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (_input: string): Promise<any> {
      return {
        email: 'any_email',
        password: 'any_password'
      }
    }
  }

  return new DecrypterStub()
}

interface SutTypes {
  sut: DbAuthByToken
  decrypterStub: Decrypter
  findUserByEmailStub: FindUserByEmailRepository
  findUserAccessRepositoryStub: FindUserAccessRepository
}
const makeSut = (): SutTypes => {
  const findUserAccessRepositoryStub = makeFindUSerAccessRepository()
  const findUserByEmailStub = makeFindUserByEmail()
  const decrypterStub = makeDecrypter()
  const sut = new DbAuthByToken(decrypterStub, findUserByEmailStub, findUserAccessRepositoryStub)

  return {
    sut,
    decrypterStub,
    findUserByEmailStub,
    findUserAccessRepositoryStub
  }
}

describe('DbAuthByToken', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.authByToken('any_token')

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.authByToken('any_token')

    await expect(promise).rejects.toThrow()
  })

  test('Should return false if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const result = await sut.authByToken('any_token')

    expect(result).toBe(false)
  })

  test('Should call FindUserByEmailRepository with correct value', async () => {
    const { sut, findUserByEmailStub } = makeSut()

    const findUserByEmailSpy = jest.spyOn(findUserByEmailStub, 'findByEmail')
    await sut.authByToken('any_token')

    expect(findUserByEmailSpy).toHaveBeenCalledWith('any_email')
  })

  test('Should throw if FindUserByEmailRepository throws', async () => {
    const { sut, findUserByEmailStub } = makeSut()

    jest.spyOn(findUserByEmailStub, 'findByEmail').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.authByToken('any_token')

    await expect(promise).rejects.toThrow()
  })

  test('Should return false if FindUserByEmailRepository returns null', async () => {
    const { sut, findUserByEmailStub } = makeSut()

    jest.spyOn(findUserByEmailStub, 'findByEmail').mockResolvedValueOnce(null as any)
    const result = await sut.authByToken('any_token')

    expect(result).toBe(false)
  })

  test('Should call FindUserAccessRepository with correct value', async () => {
    const { sut, findUserAccessRepositoryStub } = makeSut()

    const findUserAccessRepositoryStubSpy =
     jest.spyOn(findUserAccessRepositoryStub, 'findUserAccess')
    await sut.authByToken('any_token')

    expect(findUserAccessRepositoryStubSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })
})
