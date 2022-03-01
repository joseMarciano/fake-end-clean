import { ValidationErrorComposite } from '../../../../../presentation/validators/ValidationErrorComposite'
import { Validator } from '../../../../../presentation/protocols'
import { RequiredFieldValidation } from '../../../../../presentation/validators/RequiredFieldValidation'
import { RequestBodyValidation } from '../../../../../presentation/validators/RequestBodyValidation'

export const makeValidationComposite = (): Validator => {
  const composite = ValidationErrorComposite.builder()

  const requiredFieldValidation = ['email', 'password'].map((field) => RequiredFieldValidation.builder().field(field).build())
  requiredFieldValidation.forEach((validator) => composite.validator(new RequestBodyValidation(validator)))

  return composite.build()
}
