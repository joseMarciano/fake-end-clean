import { AddUserRepository } from 'src/data/protocols/AddUserRepository'
import { User } from 'src/domain/model/User'
import { UserModel } from 'src/domain/usecases/AddUser'
import { DbAddUser } from './DbAddUser'

const makeFakeUserModel = (): UserModel => ({
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'any_password'
})

const makeFakeUser = (): User => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'any_password'
})

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
}
const makeSut = (): SutTypes => {
  const addUserRepositoryStub = makeAddUserRepository()
  const sut = new DbAddUser(addUserRepositoryStub)

  return {
    sut,
    addUserRepositoryStub
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
})
