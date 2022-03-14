import { RequiredFieldValidation } from '../../../../../presentation/validators/RequiredFieldValidation'
import { ValidationErrorComposite } from '../../../../../presentation/validators/ValidationErrorComposite'
import { makeValidationComposite } from './findResourceByProjectIdValidationCompositeFactory'
import { PathParamValidation } from '../../../../../presentation/validators/PathParamsValidation'

describe('findResourceByProjectIdValidationCompositeFactory', () => {
  test('Should call ValidatorComposite with all Validators', () => {
    const sut = makeValidationComposite() as ValidationErrorComposite

    const pathRequiredFieldValidation = ['projectId'].map(field => new PathParamValidation(RequiredFieldValidation.builder().field(field).build()))
    const composite = ValidationErrorComposite
      .builder()

    pathRequiredFieldValidation.forEach(validation => composite.validator(validation))

    expect(sut.validators).toEqual(pathRequiredFieldValidation)
  })
})
