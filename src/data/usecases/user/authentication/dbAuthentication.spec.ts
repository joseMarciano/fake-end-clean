import { AuthenticationModel } from '../../../../domain/usecases/user/authentication/Authentication'
import { Encrypter } from '../../../../data/protocols/cryptography/Encrypter'
import { DbAuthentication } from './DbAuthentication'

const makeFakeAuthenticationModel = (): AuthenticationModel => ({
  id: 'any_id',
  email: 'any_email',
  password: 'any_password'
})
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
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeDecrypter()
  const sut = new DbAuthentication(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('DbAuthentication', () => {
  test('Should call Encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuthenticationModel())

    expect(encryptSpy).toHaveBeenCalledWith(makeFakeAuthenticationModel())
  })
})
