import { AuthenticationModel } from '../../../../domain/usecases/user/authentication/Authentication'
import { Encrypter } from '../../../../data/protocols/cryptography/Encrypter'
import { DbAuthentication } from './DbAuthentication'
import { User } from '../../../../domain/model/User'
import { FindUserByIdRepository } from '../../../../data/protocols/user/FindUserByIdRepository'

const makeFakeAuthenticationModel = (): AuthenticationModel => ({
  id: 'any_id',
  email: 'any_email',
  password: 'any_password'
})

const makeFakeUser = (): User => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password',
  isActive: false
})

const makeFindUserByIdRepository = (): FindUserByIdRepository => {
  class FindUserByIdRepositoryStub implements FindUserByIdRepository {
    async findById (id: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }

  return new FindUserByIdRepositoryStub()
}

const makeDecrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (_input: any): Promise<string> {
      return await Promise.resolve('')
    }
  }

  return new EncrypterStub()
}

interface SutTypes {
  sut: DbAuthentication
  encrypterStub: Encrypter
  loadUserByIdRepositoryStub: FindUserByIdRepository
}

const makeSut = (): SutTypes => {
  const loadUserByIdRepositoryStub = makeFindUserByIdRepository()
  const encrypterStub = makeDecrypter()
  const sut = new DbAuthentication(encrypterStub, loadUserByIdRepositoryStub)

  return {
    sut,
    encrypterStub,
    loadUserByIdRepositoryStub
  }
}

describe('DbAuthentication', () => {
  test('Should call Encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuthenticationModel())

    expect(encryptSpy).toHaveBeenCalledWith(makeFakeAuthenticationModel())
  })
  test('Should throws if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(makeFakeAuthenticationModel())

    await expect(promise).rejects.toThrow()
  })
  test('Should call FindUserByIdRepository with correct value', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()

    const loadByIdSpy = jest.spyOn(loadUserByIdRepositoryStub, 'findById')
    await sut.auth(makeFakeAuthenticationModel())

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
