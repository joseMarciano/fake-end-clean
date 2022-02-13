import bcrypt from 'bcrypt'
import { BcryptAdapter } from './BcryptAdapter'

const SALT = 12

jest.mock('bcrypt', () => {
  return {
    async hash (): Promise<string> {
      return await Promise.resolve('hasher_input')
    },
    async compare (): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
})

interface SutTypes {
  sut: BcryptAdapter
}
const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter(SALT)

  return {
    sut
  }
}

describe('BcryptAdapter', () => {
  describe('INTERFACE Hasher', () => {
    test('Should call hash with correct values', async () => {
      const { sut } = makeSut()

      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_input')

      expect(hashSpy).toHaveBeenCalledWith('any_input', SALT)
    })
    test('Should return a valid hash when hash succeeds', async () => {
      const { sut } = makeSut()

      const hasher = await sut.hash('any_input')

      expect(hasher).toBe('hasher_input')
    })
    test('Should throw if bcrypt throws', async () => {
      const { sut } = makeSut()

      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.hash('any_input')

      await expect(promise).rejects.toThrow()
    })
  })
  describe('INTERFACE HashCompare', () => {
    test('Should call compare with correct values', async () => {
      const { sut } = makeSut()

      const comapreSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_input', 'any_hashed_value')

      expect(comapreSpy).toHaveBeenCalledWith('any_input', 'any_hashed_value')
    })
    test('Should return  true if compare returns true', async () => {
      const { sut } = makeSut()

      const compare = await sut.compare('any_input', 'any_hashed_value')

      expect(compare).toBe(true)
    })
  })
})
