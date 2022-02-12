import { AuthenticationModel } from '../../../../domain/usecases/user/authentication/Authentication'
import { Encrypter } from '../../../../data/protocols/cryptography/Encrypter'
import { DbAuthentication } from './DbAuthentication'
import { User } from '../../../../domain/model/User'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { HashCompare } from '../../../../data/protocols/cryptography/HashCompare'

const makeFakeAuthenticationModel = (): AuthenticationModel => ({
  email: 'any_email',
  password: 'any_password'
})

const makeFakeUser = (): User => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'hashed_password',
  isActive: false
})

const makeHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (data: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new HashCompareStub()
}

const makeFindUserByIdRepository = (): FindUserByEmailRepository => {
  class FindUserByEmailRepository implements FindUserByEmailRepository {
    async findByEmail (_email: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }

  return new FindUserByEmailRepository()
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
  loadUserByIdRepositoryStub: FindUserByEmailRepository
  hashCompareStub: HashCompare
}

const makeSut = (): SutTypes => {
  const hashCompareStub = makeHashCompare()
  const loadUserByIdRepositoryStub = makeFindUserByIdRepository()
  const encrypterStub = makeDecrypter()
  const sut = new DbAuthentication(encrypterStub, loadUserByIdRepositoryStub, hashCompareStub)

  return {
    sut,
    encrypterStub,
    loadUserByIdRepositoryStub,
    hashCompareStub
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
  test('Should call FindUserByEmailRepository with correct value', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()

    const loadByIdSpy = jest.spyOn(loadUserByIdRepositoryStub, 'findByEmail')
    await sut.auth(makeFakeAuthenticationModel())

    expect(loadByIdSpy).toHaveBeenCalledWith('any_email')
  })

  test('Should throws if FindUserByEmailRepository throws', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()

    jest.spyOn(loadUserByIdRepositoryStub, 'findByEmail').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(makeFakeAuthenticationModel())

    await expect(promise).rejects.toThrow()
  })

  test('Should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()

    const hashSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(makeFakeAuthenticationModel())

    expect(hashSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throws if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()

    jest.spyOn(hashCompareStub, 'compare').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(makeFakeAuthenticationModel())

    await expect(promise).rejects.toThrow()
  })
})