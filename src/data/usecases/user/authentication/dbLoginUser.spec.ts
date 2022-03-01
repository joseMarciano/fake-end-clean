import { User } from '../../../../domain/model/User'
import { LoginUserModel } from '../../../../domain/usecases/user/authentication/LoginUser'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { DbLoginUser } from './DbLoginUser'
import { LoginUserError } from '../../../../domain/usecases/user/validations/LoginUserError'
import { HashCompare } from '../../../../data/protocols/cryptography/HashCompare'
import { RandomStringGenerator } from '../../../../data/protocols/cryptography/RandomStringGenerator'
import { AddUserRefreshTokenModel, AddUserRefreshTokenRepository } from '../../../../data/protocols/user/AddUserRefreshTokenRepository'

const makeFakeUser = (): User => ({
  id: 'any_id',
  email: 'any_email',
  isActive: false,
  name: 'any_name',
  password: 'hashed_password'
})

const makeFakeLoginUserModel = (): LoginUserModel => ({
  email: 'any_email',
  password: 'any_password'
})

const makeFindUserByEmailRepository = (): FindUserByEmailRepository => {
  class FindUserByEmailRepositoryStub implements FindUserByEmailRepository {
    async findByEmail (email: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }

  return new FindUserByEmailRepositoryStub()
}

const makeHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (_data: string, _hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new HashCompareStub()
}

const makeRandomStringGenerator = (): RandomStringGenerator => {
  class RandomStringGeneratorStub implements RandomStringGenerator {
    async generateRandomString (): Promise<string> {
      return 'any_string'
    }
  }

  return new RandomStringGeneratorStub()
}

const makeAddUserRefreshTokenRepository = (): AddUserRefreshTokenRepository => {
  class AddUserRefreshTokenRepositoryStub implements AddUserRefreshTokenRepository {
    async addRefreshToken (_data: AddUserRefreshTokenModel): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new AddUserRefreshTokenRepositoryStub()
}

interface SutTypes {
  sut: DbLoginUser
  findUserByEmailRepositoryStub: FindUserByEmailRepository
  hashCompareStub: HashCompare
  randomStringGeneratorStub: RandomStringGenerator
  addRefreshTokenRespotoryStub: AddUserRefreshTokenRepository
}

const makeSut = (): SutTypes => {
  const addRefreshTokenRespotoryStub = makeAddUserRefreshTokenRepository()
  const randomStringGeneratorStub = makeRandomStringGenerator()
  const hashCompareStub = makeHashCompare()
  const findUserByEmailRepositoryStub = makeFindUserByEmailRepository()
  const sut = new DbLoginUser(findUserByEmailRepositoryStub, hashCompareStub, randomStringGeneratorStub, addRefreshTokenRespotoryStub)

  return {
    sut,
    findUserByEmailRepositoryStub,
    hashCompareStub,
    randomStringGeneratorStub,
    addRefreshTokenRespotoryStub
  }
}

describe('DbLoginUser', () => {
  test('Should call FindUserByEmailRepository with correct value', async () => {
    const { sut, findUserByEmailRepositoryStub } = makeSut()

    const findUserByEmailStub = jest.spyOn(findUserByEmailRepositoryStub, 'findByEmail')
    await sut.login(makeFakeLoginUserModel())

    expect(findUserByEmailStub).toHaveBeenCalledWith('any_email')
  })

  test('Should throws if FindUserByEmailRepository throws', async () => {
    const { sut, findUserByEmailRepositoryStub } = makeSut()

    jest.spyOn(findUserByEmailRepositoryStub, 'findByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.login(makeFakeLoginUserModel())

    await expect(promise).rejects.toThrowError()
  })

  test('Should return LoginUserError if FindUserByEmailRepository returns null', async () => {
    const { sut, findUserByEmailRepositoryStub } = makeSut()

    jest.spyOn(findUserByEmailRepositoryStub, 'findByEmail').mockResolvedValueOnce(null as any)
    const result = await sut.login(makeFakeLoginUserModel())

    expect(result).toEqual(new LoginUserError('Email or password are incorrects'))
  })

  test('Should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()

    const hashSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.login(makeFakeLoginUserModel())

    expect(hashSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should return LoginUserError if HashCompare returns false', async () => {
    const { sut, hashCompareStub } = makeSut()

    jest.spyOn(hashCompareStub, 'compare').mockResolvedValueOnce(false)
    const result = await sut.login(makeFakeLoginUserModel())

    expect(result).toEqual(new LoginUserError('Email or password are incorrects'))
  })

  test('Should throws if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()

    jest.spyOn(hashCompareStub, 'compare').mockRejectedValueOnce(new Error())
    const promise = sut.login(makeFakeLoginUserModel())

    await expect(promise).rejects.toThrowError()
  })

  test('Should call RandomStringGenerator', async () => {
    const { sut, randomStringGeneratorStub } = makeSut()

    const randomStringGeneratorSpy = jest.spyOn(randomStringGeneratorStub, 'generateRandomString')
    await sut.login(makeFakeLoginUserModel())

    expect(randomStringGeneratorSpy).toHaveBeenCalledTimes(1)
  })

  test('Should throws if RandomStringGenerator throws', async () => {
    const { sut, randomStringGeneratorStub } = makeSut()

    jest.spyOn(randomStringGeneratorStub, 'generateRandomString').mockRejectedValueOnce(new Error())
    const promise = sut.login(makeFakeLoginUserModel())

    await expect(promise).rejects.toThrowError()
  })

  test('Should throws if RandomStringGenerator throws', async () => {
    const { sut, randomStringGeneratorStub } = makeSut()

    jest.spyOn(randomStringGeneratorStub, 'generateRandomString').mockRejectedValueOnce(new Error())
    const promise = sut.login(makeFakeLoginUserModel())

    await expect(promise).rejects.toThrowError()
  })

  test('Should call AddRefreshTokenRepository with correct values', async () => {
    const { sut, addRefreshTokenRespotoryStub } = makeSut()

    const addRefreshTokenRepositorySpy = jest.spyOn(addRefreshTokenRespotoryStub, 'addRefreshToken')
    await sut.login(makeFakeLoginUserModel())

    expect(addRefreshTokenRepositorySpy).toHaveBeenCalledWith({
      userId: 'any_id',
      refreshToken: 'any_string'
    })
  })
})
