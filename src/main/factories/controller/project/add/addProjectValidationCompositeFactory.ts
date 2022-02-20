import { ValidationErrorComposite } from '../../../../../presentation/validators/ValidationErrorComposite'
import { Validator } from '../../../../../presentation/protocols'
import { RequestBodyValidation } from '../../../../../presentation/validators/RequestBodyValidation'
import { RequiredFieldValidation } from '../../../../../presentation/validators/RequiredFieldValidation'
import { RequestParamValidation } from '../../../../../presentation/validators/RequestParamsValidation'

export const makeValidationComposite = (): Validator => {
  const bodyRequiredFieldValidation = RequiredFieldValidation
    .builder()
    .field('title')
    .field('description')
    .build()

  const paramsRequiredFieldValidation = RequiredFieldValidation
    .builder()
    .field('userId')
    .build()

  const requestBodyValidaton = new RequestBodyValidation(bodyRequiredFieldValidation)
  const requestParamsValidaton = new RequestParamValidation(paramsRequiredFieldValidation)

  return ValidationErrorComposite
    .builder()
    .validator(requestBodyValidaton)
    .validator(requestParamsValidaton)
    .build()
}
