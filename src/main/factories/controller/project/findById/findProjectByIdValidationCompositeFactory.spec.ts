import { RequiredFieldValidation } from '../../../../../presentation/validators/RequiredFieldValidation'
import { ValidationErrorComposite } from '../../../../../presentation/validators/ValidationErrorComposite'
import { makeValidationComposite } from './findProjectByIdValidationCompositeFactory'
import { PathParamValidation } from '../../../../../presentation/validators/PathParamsValidation'

describe('findProjectByIdValidationCompositeFactory', () => {
  test('Should call ValidatorComposite with all Validators', () => {
    const sut = makeValidationComposite() as ValidationErrorComposite

    const pathRequiredFields = ['id'].map(field => new PathParamValidation(RequiredFieldValidation.builder().field(field).build()))
    const validationErrorComposite = ValidationErrorComposite.builder()
    pathRequiredFields.forEach(validation => validationErrorComposite.validator(validation))

    expect(sut.validators).toEqual(validationErrorComposite.build().validators)
  })
})
