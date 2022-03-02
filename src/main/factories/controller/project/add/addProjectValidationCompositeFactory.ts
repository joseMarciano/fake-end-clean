import { ValidationErrorComposite } from '../../../../../presentation/validators/ValidationErrorComposite'
import { Validator } from '../../../../../presentation/protocols'
import { RequestBodyValidation } from '../../../../../presentation/validators/RequestBodyValidation'
import { RequiredFieldValidation } from '../../../../../presentation/validators/RequiredFieldValidation'

export const makeValidationComposite = (): Validator => {
  const bodyRequiredFieldValidation = RequiredFieldValidation
    .builder()
    .field('title')
    .field('description')
    .build()

  const requestBodyValidaton = new RequestBodyValidation(bodyRequiredFieldValidation)

  return ValidationErrorComposite
    .builder()
    .validator(requestBodyValidaton)
    .build()
}
