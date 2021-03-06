import { User, UserAccessToken } from '../../../../domain/model/User'
import { ActivateUserModel } from '../../../../domain/usecases/user/activate/ActivateUser'
import { DbActiveUser } from './DbActiveUser'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { ActiveUserByIdRepository } from '../../../../data/protocols/user/ActiveUserByIdRepository'
import { FindUserAccessRepository } from '../../../../data/protocols/user/FindUserAccessRepository'
import { ActivateUserError } from '../../../../domain/usecases/user/validations/ActivateUserError'

const makeFakeUser = (): User => ({
  id: 'any_id',
  email: 'any_email',
  isActive: false,
  name: 'any_name',
  password: 'any_password'
})

const makeFakeUserActivateModel = (): ActivateUserModel => ({
  encryptedValue: 'any_encrypted_value'
})

const makeFindUserAccessRepositoryStub = (): FindUserAccessRepository => {
  class FindUserAccessRepositoryStub implements FindUserAccessRepository {
    async findUserAccess (_userId: string, _accessToken: string): Promise<UserAccessToken> {
      return {
        id: 'any_id',
        accessToken: 'any_token',
        userId: 'any_id',
        createdAt: new Date()
      }
    }
  }

  return new FindUserAccessRepositoryStub()
}

const makeActiveUserByIdRepository = (): ActiveUserByIdRepository => {
  class ActiveUserByIdRepositoryStub implements ActiveUserByIdRepository {
    async activeById (_id: string): Promise<User> {
      return await Promise.resolve({
        ...makeFakeUser(),
        isActive: true
      })
    }
  }

  return new ActiveUserByIdRepositoryStub()
}

const makeFindUserByEmailRepository = (): FindUserByEmailRepository => {
  class FindUserByEmailRepositoryStub implements FindUserByEmailRepository {
    async findByEmail (_email: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }

  return new FindUserByEmailRepositoryStub()
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (input: string): Promise<any> {
      return await Promise.resolve({
        email: 'any_email',
        password: 'any_password'
      })
    }
  }

  return new DecrypterStub()
}

interface SutTypes {
  sut: DbActiveUser
  decrypterStub: Decrypter
  findUserByEmailRepositoryStub: FindUserByEmailRepository
  activeUserByIdRepositoryStub: ActiveUserByIdRepository
  findUserAccessTokenRepositoryStub: FindUserAccessRepository
}
const makeSut = (): SutTypes => {
  const findUserAccessTokenRepositoryStub = makeFindUserAccessRepositoryStub()
  const activeUserByIdRepositoryStub = makeActiveUserByIdRepository()
  const decrypterStub = makeDecrypter()
  const findUserByEmailRepositoryStub = makeFindUserByEmailRepository()

  const sut = new DbActiveUser(
    decrypterStub,
    findUserByEmailRepositoryStub,
    activeUserByIdRepositoryStub,
    findUserAccessTokenRepositoryStub
  )

  return {
    sut,
    decrypterStub,
    findUserByEmailRepositoryStub,
    activeUserByIdRepositoryStub,
    findUserAccessTokenRepositoryStub
  }
}

describe('DbActiveUser', () => {
  test('Should call Decrypter  with correct value', async () => {
    const { sut, decrypterStub } = makeSut()

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.active(makeFakeUserActivateModel())

    expect(decryptSpy).toHaveBeenCalledWith('any_encrypted_value')
  })

  test('Should call FindUserByEmailRepository with correct value', async () => {
    const { sut, findUserByEmailRepositoryStub } = makeSut()

    const findUserByEmailStub = jest.spyOn(findUserByEmailRepositoryStub, 'findByEmail')
    await sut.active(makeFakeUserActivateModel())

    expect(findUserByEmailStub).toHaveBeenCalledWith('any_email')
  })

  test('Should call ActiveUserByIdRepository with correct value', async () => {
    const { sut, activeUserByIdRepositoryStub } = makeSut()

    const activeByIdSpy = jest.spyOn(activeUserByIdRepositoryStub, 'activeById')
    await sut.active(makeFakeUserActivateModel())

    expect(activeByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return an User on DbActiveUser succeeds', async () => {
    const { sut } = makeSut()

    const user = await sut.active(makeFakeUserActivateModel())

    expect(user).toEqual({
      ...makeFakeUser(),
      isActive: true
    })
  })

  test('Should throws if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const promise = sut.active(makeFakeUserActivateModel())

    await expect(promise).rejects.toThrowError()
  })

  test('Should return ActivateUserError if Decrypter fails', async () => {
    const { sut, decrypterStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValue(null)
    const error = await sut.active(makeFakeUserActivateModel())

    expect(error).toEqual(new ActivateUserError('Error on decrypt'))
  })

  test('Should return ActivateUserError if FindUserAccessRepository fails', async () => {
    const { sut, findUserAccessTokenRepositoryStub } = makeSut()

    jest.spyOn(findUserAccessTokenRepositoryStub, 'findUserAccess').mockResolvedValue(null as any)
    const error = await sut.active(makeFakeUserActivateModel())

    expect(error).toEqual(new ActivateUserError('Invalid access token'))
  })

  test('Should return ActivateUserError if FindByEmailRepository fails', async () => {
    const { sut, findUserByEmailRepositoryStub } = makeSut()

    jest.spyOn(findUserByEmailRepositoryStub, 'findByEmail').mockResolvedValue(null as any)
    const error = await sut.active(makeFakeUserActivateModel())

    expect(error).toEqual(new ActivateUserError('User with email any_email not found'))
  })

  test('Should throws if FindUserByEmailRepository throws', async () => {
    const { sut, findUserByEmailRepositoryStub } = makeSut()

    jest.spyOn(findUserByEmailRepositoryStub, 'findByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.active(makeFakeUserActivateModel())

    await expect(promise).rejects.toThrowError()
  })

  test('Should throws if ActiveUserByIdRepository throws', async () => {
    const { sut, activeUserByIdRepositoryStub } = makeSut()

    jest.spyOn(activeUserByIdRepositoryStub, 'activeById').mockRejectedValueOnce(new Error())
    const promise = sut.active(makeFakeUserActivateModel())

    await expect(promise).rejects.toThrowError()
  })

  test('Should call FindUserAccessRepository with correct value', async () => {
    const { sut, findUserAccessTokenRepositoryStub } = makeSut()

    const findUserAccessSpy = jest.spyOn(findUserAccessTokenRepositoryStub, 'findUserAccess')
    await sut.active(makeFakeUserActivateModel())

    expect(findUserAccessSpy).toHaveBeenCalledWith('any_id', 'any_encrypted_value')
  })
})
