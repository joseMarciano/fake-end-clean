import { ValidationErrorComposite } from '../../../../../presentation/validators/ValidationErrorComposite'
import { Validator } from '../../../../../presentation/protocols'
import { RequiredFieldValidation } from '../../../../../presentation/validators/RequiredFieldValidation'
import { PathParamValidation } from '../../../../../presentation/validators/PathParamsValidation'

export const makeValidationComposite = (): Validator => {
  const pathRequiredFieldValidation = ['projectId'].map(field => new PathParamValidation(RequiredFieldValidation.builder().field(field).build()))
  const composite = ValidationErrorComposite
    .builder()

  pathRequiredFieldValidation.forEach(validation => composite.validator(validation))

  return composite.build()
}
