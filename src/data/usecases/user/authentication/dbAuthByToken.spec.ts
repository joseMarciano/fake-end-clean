import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { DbAuthByToken } from './DbAuthByToken'

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
}
const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const sut = new DbAuthByToken(decrypterStub)

  return {
    sut,
    decrypterStub
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
})
