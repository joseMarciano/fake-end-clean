import { Validator } from '../../../../presentation/protocols'
import { CompareFieldsValidation } from '../../../../presentation/validators/CompareFieldsValidaton'
import { RequiredFieldValidation } from '../../../../presentation/validators/RequiredFieldValidation'
import { ValidationErrorComposite } from '../../../../presentation/validators/ValidationErrorComposite'

export const makeValidationComposite = (): Validator => {
  const composite = ValidationErrorComposite.builder()

  const requiredFieldValidation = ['name', 'email', 'password', 'passwordConfirmation'].map((field) => RequiredFieldValidation.builder().field(field).build())
  requiredFieldValidation.forEach((validator) => composite.validator(validator))

  const compareFieldsValidation = CompareFieldsValidation
    .builder()
    .field('password')
    .fieldToCompare('passwordConfirmation')
    .build()

  return composite.validator(compareFieldsValidation).build()
}
