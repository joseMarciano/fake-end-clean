import { EmailValidator } from '../../data/protocols/validators/EmailValidator'
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
  const sut = new EmailFieldValidation(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('EmailFieldValidation', () => {
  test('Should call EmailValidator with correct values', () => {
    const { sut, emailValidatorStub } = makeSut()

    const validateSpy = jest.spyOn(emailValidatorStub, 'validate')

    sut.validate('any_email')

    expect(validateSpy).toHaveBeenCalledWith('any_email')
  })
})
