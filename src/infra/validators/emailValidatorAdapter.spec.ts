import IsEmail from 'isemail'
import { EmailValidatorAdapter } from './EmailValidatorAdapter'

jest.mock('isemail', () => ({
  validate (_input: string): boolean {
    return true
  }
}))

interface SutTypes {
  sut: EmailValidatorAdapter
}

const makeSut = (): SutTypes => {
  const sut = new EmailValidatorAdapter()
  return {
    sut
  }
}

describe('EmailValidadorAdapter', () => {
  test('Should call IsEmail with correct values', () => {
    const { sut } = makeSut()

    const validateSpy = jest.spyOn(IsEmail, 'validate')
    sut.validate('any_input')

    expect(validateSpy).toHaveBeenCalledWith('any_input')
  })

  test('Should return false if IsEmail returns false', () => {
    const { sut } = makeSut()

    jest.spyOn(IsEmail, 'validate').mockReturnValueOnce(false as any)

    const emailIsValid = sut.validate('any_input')

    expect(emailIsValid).toBe(false)
  })
})
