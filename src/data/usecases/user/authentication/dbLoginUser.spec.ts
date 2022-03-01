import { User } from '../../../../domain/model/User'
import { LoginUserModel } from '../../../../domain/usecases/user/authentication/LoginUser'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { DbLoginUser } from './DbLoginUser'
import { LoginUserError } from '../../../../domain/usecases/user/validations/LoginUserError'
import { HashCompare } from '../../../../data/protocols/cryptography/HashCompare'

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

interface SutTypes {
  sut: DbLoginUser
  findUserByEmailRepositoryStub: FindUserByEmailRepository
  hashCompareStub: HashCompare
}

const makeSut = (): SutTypes => {
  const hashCompareStub = makeHashCompare()
  const findUserByEmailRepositoryStub = makeFindUserByEmailRepository()
  const sut = new DbLoginUser(findUserByEmailRepositoryStub, hashCompareStub)

  return {
    sut,
    findUserByEmailRepositoryStub,
    hashCompareStub
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
})
