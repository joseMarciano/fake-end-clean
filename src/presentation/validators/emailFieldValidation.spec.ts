import { EmailValidator } from '../../data/protocols/validators/EmailValidator'
import { InvalidParamError } from '../controllers/errors/InvalidParamError'
import { EmailFieldValidation } from './EmailFieldValidation'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    validate (_input: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailFieldValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailFieldValidation(emailValidatorStub, 'email')

  return {
    sut,
    emailValidatorStub
  }
}

describe('EmailFieldValidation', () => {
  test('Should call EmailValidator with correct values', () => {
    const { sut, emailValidatorStub } = makeSut()

    const validateSpy = jest.spyOn(emailValidatorStub, 'validate')

    sut.validate({ email: 'any_email' })

    expect(validateSpy).toHaveBeenCalledWith('any_email')
  })

  test('Should return InvalidParamError if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'validate').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'any_email' })

    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should return null if EmailValidator returns true', () => {
    const { sut } = makeSut()
    const error = sut.validate({ email: 'any_email' })

    expect(error).toBeNull()
  })
})
