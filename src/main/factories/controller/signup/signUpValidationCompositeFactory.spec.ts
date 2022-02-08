import { EmailValidatorAdapter } from '../../../../infra/validators/EmailValidatorAdapter'
import { EmailFieldValidation } from '../../../../presentation/validators/EmailFieldValidation'
import { Validator } from '../../../../presentation/protocols'
import { CompareFieldsValidation } from '../../../../presentation/validators/CompareFieldsValidaton'
import { RequiredFieldValidation } from '../../../../presentation/validators/RequiredFieldValidation'
import { ValidationErrorComposite } from '../../../../presentation/validators/ValidationErrorComposite'
import { makeValidationComposite } from './signUpValidationCompositeFactory'

describe('signUpValidationComposioteFactory', () => {
  test('Should call ValidatorComposit with all Validators', () => {
    const sut = makeValidationComposite() as ValidationErrorComposite

    const validators: Validator[] = []
    const requiredFieldValidation = ['name', 'email', 'password', 'passwordConfirmation'].map((field) => RequiredFieldValidation.builder().field(field).build())
    requiredFieldValidation.forEach((validator) => validators.push(validator))

    validators.push(CompareFieldsValidation
      .builder()
      .field('password')
      .fieldToCompare('passwordConfirmation')
      .build())

    validators.push(new EmailFieldValidation(new EmailValidatorAdapter(), 'email'))

    expect(sut.validators).toEqual(validators)
  })
})
