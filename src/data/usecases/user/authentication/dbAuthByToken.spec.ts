import { FindUserByEmailRepository } from 'src/data/protocols/user/FindUserByEmailRepository'
import { User } from 'src/domain/model/User'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { DbAuthByToken } from './DbAuthByToken'

const makeFakeUser = (): User => ({
  id: 'any_id',
  email: 'any_email',
  isActive: true,
  name: 'any_name',
  password: 'any_password'
})

const makeFindUserByEmail = (): FindUserByEmailRepository => {
  class FindUserByEmailRepositoryStub implements FindUserByEmailRepository {
    async findByEmail (email: string): Promise<User> {
      return makeFakeUser()
    }
  }

  return new FindUserByEmailRepositoryStub()
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (_input: string): Promise<any> {
      return {
        email: 'any_email',
        password: 'any_password'
      }
    }
  }

  return new DecrypterStub()
}

interface SutTypes {
  sut: DbAuthByToken
  decrypterStub: Decrypter
  findUserByEmailStub: FindUserByEmailRepository
}
const makeSut = (): SutTypes => {
  const findUserByEmailStub = makeFindUserByEmail()
  const decrypterStub = makeDecrypter()
  const sut = new DbAuthByToken(decrypterStub, findUserByEmailStub)

  return {
    sut,
    decrypterStub,
    findUserByEmailStub
  }
}

describe('DbAuthByToken', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.authByToken('any_token')

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.authByToken('any_token')

    await expect(promise).rejects.toThrow()
  })

  test('Should return false if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const result = await sut.authByToken('any_token')

    expect(result).toBe(false)
  })

  test('Should call FindUserByEmailRepository with correct value', async () => {
    const { sut, findUserByEmailStub } = makeSut()

    const findUserByEmailSpy = jest.spyOn(findUserByEmailStub, 'findByEmail')
    await sut.authByToken('any_token')

    expect(findUserByEmailSpy).toHaveBeenCalledWith('any_email')
  })
})
