import { ValidationErrorComposite } from '../../../../../presentation/validators/ValidationErrorComposite'
import { Validator } from '../../../../../presentation/protocols'
import { RequestBodyValidation } from '../../../../../presentation/validators/RequestBodyValidation'
import { RequiredFieldValidation } from '../../../../../presentation/validators/RequiredFieldValidation'

export const makeValidationComposite = (): Validator => {
  const bodyRequiredFieldValidation = ['title', 'description'].map(field => new RequestBodyValidation(RequiredFieldValidation.builder().field(field).build()))
  const composite = ValidationErrorComposite
    .builder()

  bodyRequiredFieldValidation.forEach(validation => composite.validator(validation))

  return composite.build()
}
