import { ActivateUserModel } from '../../../../domain/usecases/user/activate/ActivateUser'
import { DbActiveUser } from './DbActiveUser'
import { Decrypter } from 'src/data/protocols/cryptography/Decrypter'

const makeFakeUserActivateModel = (): ActivateUserModel => ({
  encryptedValue: 'any_encrypted_value'
})

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
}
const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const sut = new DbActiveUser(decrypterStub)
  return {
    sut,
    decrypterStub
  }
}

describe('DbActiveUser', () => {
  test('Should call Encrypter  with correct value', async () => {
    const { sut, decrypterStub } = makeSut()

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.active(makeFakeUserActivateModel())

    expect(decryptSpy).toHaveBeenCalledWith('any_encrypted_value')
  })
})
