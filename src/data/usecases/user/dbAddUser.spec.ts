import { AddUserRepository } from '../../../data/protocols/AddUserRepository'
import { FindUserByEmailRepository } from '../../../data/protocols/FindUserByEmailRepository'
import { User } from '../../../domain/model/User'
import { EmailInUseError } from '../../../domain/usecases/user/validations/EmailInUseError'
import { UserModel } from '../../../domain/usecases/user/AddUser'
import { Hasher } from '../../../data/protocols/cryptography/Hasher'
import { DbAddUser } from './DbAddUser'

const makeFakeUserModel = (): UserModel => ({
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'any_password',
  isActive: false
})

const makeFakeUser = (): User => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'hasher_password',
  isActive: true
})

const makeHasher = (): Hasher => {
  class HahserStub implements Hasher {
    async hash (input: string): Promise<string> {
      return await Promise.resolve('hasher_password')
    }
  }

  return new HahserStub()
}

const makeAddUserRepository = (): AddUserRepository => {
  class AddUserRepositoryStub implements AddUserRepository {
    async add (userModel: UserModel): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }

  return new AddUserRepositoryStub()
}

const makeFindUserByEmailRepository = (): FindUserByEmailRepository => {
  class FindUserByEmailRepositoryStub implements FindUserByEmailRepositoryStub {
    async findByEmail (_email: string): Promise<User> {
      return await Promise.resolve(null as any)
    }
  }

  return new FindUserByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAddUser
  addUserRepositoryStub: AddUserRepository
  hasherStub: Hasher
  findUserByEmailRepositoryStub: FindUserByEmailRepository
}
const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addUserRepositoryStub = makeAddUserRepository()
  const findUserByEmailRepositoryStub = makeFindUserByEmailRepository()
  const sut = new DbAddUser(addUserRepositoryStub, hasherStub, findUserByEmailRepositoryStub)

  return {
    sut,
    addUserRepositoryStub,
    hasherStub,
    findUserByEmailRepositoryStub
  }
}

describe('DbAddUser usecase', () => {
  test('Should call AddUserRepository with correct values', async () => {
    const { sut, addUserRepositoryStub } = makeSut()

    const addUserSpy = jest.spyOn(addUserRepositoryStub, 'add')

    await sut.add(makeFakeUserModel())

    expect(addUserSpy).toHaveBeenCalledWith({
      ...makeFakeUserModel(),
      password: 'hasher_password'
    })
  })
  test('Should throws if AddUserRepository throws', async () => {
    const { sut, addUserRepositoryStub } = makeSut()

    jest.spyOn(addUserRepositoryStub, 'add').mockRejectedValueOnce(new Error())

    const promise = sut.add(makeFakeUserModel())

    await expect(promise).rejects.toThrowError()
  })
  test('Should return User AddUserRepository success', async () => {
    const { sut } = makeSut()

    const user = await sut.add(makeFakeUserModel())

    await expect(user).toEqual(makeFakeUser())
  })

  test('Should call Hasher with correct values', async () => {
    const { sut, hasherStub } = makeSut()

    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.add(makeFakeUserModel())

    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should return a User with hasher password', async () => {
    const { sut } = makeSut()

    const user = await sut.add(makeFakeUserModel())

    expect(user).toEqual(makeFakeUser())
  })

  test('Should call FindUserByEmailRepository with correct values', async () => {
    const { sut, findUserByEmailRepositoryStub } = makeSut()

    const findUserByEmailSpy = jest.spyOn(findUserByEmailRepositoryStub, 'findByEmail')

    await sut.add(makeFakeUserModel())

    expect(findUserByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return EmailInUseError if already exists an User with the same email', async () => {
    const { sut, findUserByEmailRepositoryStub } = makeSut()

    jest.spyOn(findUserByEmailRepositoryStub, 'findByEmail').mockResolvedValueOnce(makeFakeUser())
    const error = await sut.add(makeFakeUserModel())

    expect(error).toEqual(new EmailInUseError('any_email@mail.com'))
  })
})
