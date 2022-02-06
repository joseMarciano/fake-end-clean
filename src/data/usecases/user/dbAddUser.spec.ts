import { Hasher } from '../../../data/protocols/cryptography/Hasher'
import { AddUserRepository } from '../../../data/protocols/AddUserRepository'
import { User } from '../../../domain/model/User'
import { UserModel } from '../../../domain/usecases/AddUser'
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
  password: 'any_password',
  isActive: true
})

const makeHasher = (): Hasher => {
  class HahserStub implements Hasher {
    async hash (input: string): Promise<string> {
      return await Promise.resolve('hasher_input')
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

interface SutTypes {
  sut: DbAddUser
  addUserRepositoryStub: AddUserRepository
  hasherStub: Hasher
}
const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addUserRepositoryStub = makeAddUserRepository()
  const sut = new DbAddUser(addUserRepositoryStub, hasherStub)

  return {
    sut,
    addUserRepositoryStub,
    hasherStub
  }
}

describe('DbAddUser usecase', () => {
  test('Should call AddUserRepository with correct values', async () => {
    const { sut, addUserRepositoryStub } = makeSut()

    const addUserSpy = jest.spyOn(addUserRepositoryStub, 'add')

    await sut.add(makeFakeUserModel())

    expect(addUserSpy).toHaveBeenCalledWith(makeFakeUserModel())
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

    await sut.add(makeFakeUser())

    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })
})
