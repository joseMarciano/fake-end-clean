import { ValidationErrorComposite } from '../../../../../presentation/validators/ValidationErrorComposite'
import { Validator } from '../../../../../presentation/protocols'
import { RequiredFieldValidation } from '../../../../../presentation/validators/RequiredFieldValidation'
import { PathParamValidation } from '../../../../../presentation/validators/PathParamsValidation'

export const makeValidationComposite = (): Validator => {
  const pathRequiredFields = ['id'].map(field => new PathParamValidation(RequiredFieldValidation.builder().field(field).build()))
  const validationErrorComposite = ValidationErrorComposite.builder()
  pathRequiredFields.forEach(validation => validationErrorComposite.validator(validation))
  return validationErrorComposite.build()
}
