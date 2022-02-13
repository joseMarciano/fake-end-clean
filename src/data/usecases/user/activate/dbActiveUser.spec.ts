import { User } from '../../../../domain/model/User'
import { ActivateUserModel } from '../../../../domain/usecases/user/activate/ActivateUser'
import { DbActiveUser } from './DbActiveUser'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { ActiveUserByIdRepository } from 'src/data/protocols/user/ActiveUserByIdRepository'

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
}
const makeSut = (): SutTypes => {
  const activeUserByIdRepositoryStub = makeActiveUserByIdRepository()
  const decrypterStub = makeDecrypter()
  const findUserByEmailRepositoryStub = makeFindUserByEmailRepository()

  const sut = new DbActiveUser(
    decrypterStub,
    findUserByEmailRepositoryStub,
    activeUserByIdRepositoryStub
  )

  return {
    sut,
    decrypterStub,
    findUserByEmailRepositoryStub,
    activeUserByIdRepositoryStub
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
})
