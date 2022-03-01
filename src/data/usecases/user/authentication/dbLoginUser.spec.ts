import { User } from '../../../../domain/model/User'
import { LoginUserModel } from '../../../../domain/usecases/user/authentication/LoginUser'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { DbLoginUser } from './DbLoginUser'

const makeFakeUser = (): User => ({
  id: 'any_id',
  email: 'any_email',
  isActive: false,
  name: 'any_name',
  password: 'any_password'
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

interface SutTypes {
  sut: DbLoginUser
  findUserByEmailRepositoryStub: FindUserByEmailRepository
}

const makeSut = (): SutTypes => {
  const findUserByEmailRepositoryStub = makeFindUserByEmailRepository()
  const sut = new DbLoginUser(findUserByEmailRepositoryStub)

  return {
    sut,
    findUserByEmailRepositoryStub
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
})
