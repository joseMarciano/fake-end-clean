import { User } from '../../../../domain/model/User'
import { ActivateUserModel } from '../../../../domain/usecases/user/activate/ActivateUser'
import { DbActiveUser } from './DbActiveUser'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'

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
}
const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const findUserByEmailRepositoryStub = makeFindUserByEmailRepository()

  const sut = new DbActiveUser(
    decrypterStub,
    findUserByEmailRepositoryStub
  )

  return {
    sut,
    decrypterStub,
    findUserByEmailRepositoryStub
  }
}

describe('DbActiveUser', () => {
  test('Should call Encrypter  with correct value', async () => {
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
})
