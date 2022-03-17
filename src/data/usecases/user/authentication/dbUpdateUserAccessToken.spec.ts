import { UpdateAccessTokenError } from '../../../../domain/usecases/user/validations/UpdateAccessTokenError'
import { FindRefreshTokenByValueRepository } from '../../../../data/protocols/user/FindRefreshTokenByValueRepository'
import { User, UserRefreshToken } from '../../../../domain/model/User'
import { DbUpdateUserAccessToken } from './DbUpdateUserAccessToken'
import { FindUserByIdRepository } from '../../../../data/protocols/user/FindUserByIdRepository'
import { Encrypter } from '../../../../data/protocols/cryptography/Encrypter'
import { AddUserAccessRepository, AddUserAccessTokenModel } from '../../../../data/protocols/user/AddUserAccessRepository'

const makeFakeUserRefreshToken = (): UserRefreshToken => ({
  id: 'any_id',
  refreshToken: 'any_refreshToken',
  userId: 'any_userId',
  createdAt: new Date('2021-05-05')
})

const makeFakeUser = (): User => ({
  id: 'any_id',
  email: 'any_email',
  isActive: false,
  name: 'any_name',
  password: 'any_password'
})

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (_input: any): Promise<string> {
      return await Promise.resolve('any_encrypted')
    }
  }

  return new EncrypterStub()
}

const makeAddUserAccessRepository = (): AddUserAccessRepository => {
  class AddUserAccessRepositoryStub implements AddUserAccessRepository {
    async addUserAccess (_addUserAccessModel: AddUserAccessTokenModel): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new AddUserAccessRepositoryStub()
}

const makeFindUserByIdRepository = (): FindUserByIdRepository => {
  class FindUserByEmailRepository implements FindUserByIdRepository {
    async findById (_id: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }

  return new FindUserByEmailRepository()
}

const makeFindRefreshTokenByValueRepository = (): FindRefreshTokenByValueRepository => {
  class FindRefreshTokenByValueRepositoryStub implements FindRefreshTokenByValueRepository {
    async findRefreshTokenByValue (_refreshToken: string): Promise<UserRefreshToken> {
      return await Promise.resolve(makeFakeUserRefreshToken())
    }
  }

  return new FindRefreshTokenByValueRepositoryStub()
}

interface SutTypes {
  sut: DbUpdateUserAccessToken
  findRefreshTokenByValueRepositoryStub: FindRefreshTokenByValueRepository
  findUserByIdRepositoryStub: FindUserByIdRepository
  encrypterStub: Encrypter
  addUserAccessRepositoryStub: AddUserAccessRepository
}

const makeSut = (): SutTypes => {
  const findRefreshTokenByValueRepositoryStub = makeFindRefreshTokenByValueRepository()
  const findUserByIdRepositoryStub = makeFindUserByIdRepository()
  const encrypterStub = makeEncrypter()
  const addUserAccessRepositoryStub = makeAddUserAccessRepository()
  const sut = new DbUpdateUserAccessToken(
    findRefreshTokenByValueRepositoryStub,
    findUserByIdRepositoryStub,
    encrypterStub,
    addUserAccessRepositoryStub
  )

  return {
    sut,
    findRefreshTokenByValueRepositoryStub,
    findUserByIdRepositoryStub,
    encrypterStub,
    addUserAccessRepositoryStub
  }
}

describe('DbUpdateUserAccessToken', () => {
  test('Should call FindRefreshTokenByValueRepository with correct value', async () => {
    const { sut, findRefreshTokenByValueRepositoryStub } = makeSut()
    const findRefreshTokenSpy = jest.spyOn(findRefreshTokenByValueRepositoryStub, 'findRefreshTokenByValue')
    await sut.updateUserAccessToken('any_refreshToken')
    expect(findRefreshTokenSpy).toHaveBeenCalledWith('any_refreshToken')
  })

  test('Should return UpdateUserAccessTokenError if  FindRefreshTokenByValueRepository returns null', async () => {
    const { sut, findRefreshTokenByValueRepositoryStub } = makeSut()
    jest.spyOn(findRefreshTokenByValueRepositoryStub, 'findRefreshTokenByValue').mockResolvedValueOnce(null as any)
    const result = await sut.updateUserAccessToken('any_refreshToken')
    expect(result).toEqual(new UpdateAccessTokenError('Refreshtoken expired'))
  })

  test('Should throws if FindRefreshTokenByValueRepository throw', async () => {
    const { sut, findRefreshTokenByValueRepositoryStub } = makeSut()
    jest.spyOn(findRefreshTokenByValueRepositoryStub, 'findRefreshTokenByValue').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.updateUserAccessToken('any_refreshToken')
    await expect(promise).rejects.toThrow()
  })

  test('Should call FindUserByIdRepository with correct value', async () => {
    const { sut, findUserByIdRepositoryStub } = makeSut()
    const findUserByIdSpy = jest.spyOn(findUserByIdRepositoryStub, 'findById')
    await sut.updateUserAccessToken('any_refreshToken')
    expect(findUserByIdSpy).toHaveBeenCalledWith('any_userId')
  })

  test('Should return UpdateUserAccessTokenError if  FindUserByIdRepository returns null', async () => {
    const { sut, findUserByIdRepositoryStub } = makeSut()
    jest.spyOn(findUserByIdRepositoryStub, 'findById').mockResolvedValueOnce(null as any)
    const result = await sut.updateUserAccessToken('any_refreshToken')
    expect(result).toEqual(new UpdateAccessTokenError())
  })

  test('Should return UpdateUserAccessTokenError if refreshtoken is null', async () => {
    const { sut } = makeSut()
    const result = await sut.updateUserAccessToken(null as any)
    expect(result).toEqual(new UpdateAccessTokenError('Refreshtoken was not provided'))
  })

  test('Should throws if FindUserByIdRepository throw', async () => {
    const { sut, findUserByIdRepositoryStub } = makeSut()
    jest.spyOn(findUserByIdRepositoryStub, 'findById').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.updateUserAccessToken('any_refreshToken')
    await expect(promise).rejects.toThrow()
  })

  test('Should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.updateUserAccessToken('any_refreshToken')
    expect(encrypSpy).toHaveBeenCalledWith({
      id: 'any_id',
      email: 'any_email'
    })
  })

  test('Should throws if Encrypter throw', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.updateUserAccessToken('any_refreshToken')
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddUserAccessRepository with correct value', async () => {
    const { sut, addUserAccessRepositoryStub } = makeSut()
    const addUserAccessSpy = jest.spyOn(addUserAccessRepositoryStub, 'addUserAccess')
    await sut.updateUserAccessToken('any_refreshToken')
    expect(addUserAccessSpy).toHaveBeenCalledWith({
      accessToken: 'any_encrypted',
      userId: 'any_id'
    })
  })

  test('Should throws if AddUserAccessRepository throws', async () => {
    const { sut, addUserAccessRepositoryStub } = makeSut()
    jest.spyOn(addUserAccessRepositoryStub, 'addUserAccess').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.updateUserAccessToken('any_refreshToken')
    await expect(promise).rejects.toThrow()
  })

  test('Should return an accessToken on UpdateUserAccessToken succeeds', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.updateUserAccessToken('any_refreshToken')
    expect(accessToken).toBe('any_encrypted')
  })
})
