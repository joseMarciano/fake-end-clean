import { AuthenticationModel } from '../../../../domain/usecases/user/authentication/Authentication'
import { Encrypter } from '../../../../data/protocols/cryptography/Encrypter'
import { DbAuthentication } from './DbAuthentication'
import { User } from '../../../../domain/model/User'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { HashCompare } from '../../../../data/protocols/cryptography/HashCompare'
import { UpdateUserAccessTokenRepository, UpdateUserAccessTokenModel } from '../../../../data/protocols/user/UpdateUserAccessTokenRepository'

const makeFakeAuthenticationModel = (): AuthenticationModel => ({
  email: 'any_email',
  password: 'any_password'
})

const makeFakeUser = (): User => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'hashed_password',
  isActive: false
})

const makeUpdateUserAccessTokenRepository = (): UpdateUserAccessTokenRepository => {
  class UpdateUserAccessTokenRepositoryStub implements UpdateUserAccessTokenRepository {
    async updateAccessToken (_data: UpdateUserAccessTokenModel): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new UpdateUserAccessTokenRepositoryStub()
}

const makeHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (data: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new HashCompareStub()
}

const makeFindUserByIdRepository = (): FindUserByEmailRepository => {
  class FindUserByEmailRepository implements FindUserByEmailRepository {
    async findByEmail (_email: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }

  return new FindUserByEmailRepository()
}

const makeDecrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (_input: any): Promise<string> {
      return await Promise.resolve('any_access_token')
    }
  }

  return new EncrypterStub()
}

interface SutTypes {
  sut: DbAuthentication
  encrypterStub: Encrypter
  loadUserByIdRepositoryStub: FindUserByEmailRepository
  hashCompareStub: HashCompare
  updateUserAccessTokenRepositoryStub: UpdateUserAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const updateUserAccessTokenRepositoryStub = makeUpdateUserAccessTokenRepository()
  const hashCompareStub = makeHashCompare()
  const loadUserByIdRepositoryStub = makeFindUserByIdRepository()
  const encrypterStub = makeDecrypter()
  const sut = new DbAuthentication(
    encrypterStub,
    loadUserByIdRepositoryStub,
    hashCompareStub,
    updateUserAccessTokenRepositoryStub
  )

  return {
    sut,
    encrypterStub,
    loadUserByIdRepositoryStub,
    hashCompareStub,
    updateUserAccessTokenRepositoryStub
  }
}

describe('DbAuthentication', () => {
  beforeAll(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2020-01-01'))
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuthenticationModel())

    expect(encryptSpy).toHaveBeenCalledWith(
      {
        ...makeFakeAuthenticationModel(),
        password: 'hashed_password'
      })
  })
  test('Should throws if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(makeFakeAuthenticationModel())

    await expect(promise).rejects.toThrow()
  })
  test('Should call FindUserByEmailRepository with correct value', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()

    const loadByIdSpy = jest.spyOn(loadUserByIdRepositoryStub, 'findByEmail')
    await sut.auth(makeFakeAuthenticationModel())

    expect(loadByIdSpy).toHaveBeenCalledWith('any_email')
  })

  test('Should throws if FindUserByEmailRepository throws', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()

    jest.spyOn(loadUserByIdRepositoryStub, 'findByEmail').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(makeFakeAuthenticationModel())

    await expect(promise).rejects.toThrow()
  })

  test('Should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()

    const hashSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(makeFakeAuthenticationModel())

    expect(hashSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throws if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()

    jest.spyOn(hashCompareStub, 'compare').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(makeFakeAuthenticationModel())

    await expect(promise).rejects.toThrow()
  })

  test('Should return access token if Authentication succeeds', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(makeFakeAuthenticationModel())

    expect(accessToken).toBe('any_access_token')
  })

  test('Should call UpdateUserAccessTokenRepository with correct values', async () => {
    const { sut, updateUserAccessTokenRepositoryStub } = makeSut()

    const updateAccessTokenSpy = jest.spyOn(updateUserAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(makeFakeAuthenticationModel())

    expect(updateAccessTokenSpy).toHaveBeenCalledWith({
      accessToken: 'any_access_token',
      userId: 'any_id',
      createdAt: new Date()
    })
  })

  test('Should throws if UpdateUserAccessTokenRepository throws', async () => {
    const { sut, updateUserAccessTokenRepositoryStub } = makeSut()

    jest.spyOn(updateUserAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(makeFakeAuthenticationModel())

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if FindUserByEmailRepository fails', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()

    jest.spyOn(loadUserByIdRepositoryStub, 'findByEmail').mockResolvedValueOnce(null as any)
    const userAccess = await sut.auth(makeFakeAuthenticationModel())

    expect(userAccess).toBeNull()
  })

  test('Should return null if HashCompare fails', async () => {
    const { sut, hashCompareStub } = makeSut()

    jest.spyOn(hashCompareStub, 'compare').mockResolvedValueOnce(false)
    const userAccess = await sut.auth(makeFakeAuthenticationModel())

    expect(userAccess).toBeNull()
  })
})
