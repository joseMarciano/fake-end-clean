import bcrypt from 'bcrypt'
import { BcryptAdapter } from './BcryptAdapter'

const SALT = 12

jest.mock('bcrypt', () => {
  return {
    async hash (): Promise<string> {
      return await Promise.resolve('hasher_input')
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
