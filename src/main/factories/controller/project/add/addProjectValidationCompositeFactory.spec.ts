import { RequiredFieldValidation } from '../../../../../presentation/validators/RequiredFieldValidation'
// import { Validator } from '../../../../../presentation/protocols'
import { ValidationErrorComposite } from '../../../../../presentation/validators/ValidationErrorComposite'
import { makeValidationComposite } from './addProjectValidationCompositeFactory'
import { RequestBodyValidation } from '../../../../../presentation/validators/RequestBodyValidation'

describe('addProjectValidationCompositeFactory', () => {
  test('Should call ValidatorComposite with all Validators', () => {
    const sut = makeValidationComposite() as ValidationErrorComposite

    const bodyRequiredFieldValidation = ['title', 'description'].map(field => new RequestBodyValidation(RequiredFieldValidation.builder().field(field).build()))
    const composite = ValidationErrorComposite
      .builder()

    bodyRequiredFieldValidation.forEach(validation => composite.validator(validation))

    expect(sut.validators).toEqual(bodyRequiredFieldValidation)
  })
})
