import jwt from 'jsonwebtoken'
import { JwtAdapter } from './JwtAdapter'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'any_encrypter'
  },
  decode (): any {
    return 'any_decoded'
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JwtAdapter', () => {
  describe('INTERFACE Encrypter', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()

      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_value')

      expect(signSpy).toHaveBeenCalledWith('any_value', 'secret')
    })
    test('Should call return a encrypted value on sign success', async () => {
      const sut = makeSut()
      const encryptedValue = await sut.encrypt('any_value')
      expect(encryptedValue).toBe('any_encrypter')
    })
    test('Should throws if sign throws', async () => {
      const sut = makeSut()

      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.encrypt('any_value')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('INTERFACE Decrypter', () => {
    test('Should call decode with correct values', async () => {
      const sut = makeSut()

      const decryptSpy = jest.spyOn(jwt, 'decode')
      await sut.decrypt('any_value')

      expect(decryptSpy).toHaveBeenCalledWith('any_value')
    })
  })
})
