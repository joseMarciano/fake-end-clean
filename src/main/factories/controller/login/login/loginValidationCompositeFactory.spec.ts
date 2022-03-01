import { ValidationErrorComposite } from '../../../../../presentation/validators/ValidationErrorComposite'
import { RequiredFieldValidation } from '../../../../../presentation/validators/RequiredFieldValidation'
import { RequestBodyValidation } from '../../../../../presentation/validators/RequestBodyValidation'
import { makeValidationComposite } from './loginValidationCompositeFactory'

describe('loginValidationCompositeFactory', () => {
  test('Should call all validators', () => {
    const composite = ValidationErrorComposite.builder()
    const requiredFieldValidation = ['email', 'password'].map((field) => RequiredFieldValidation.builder().field(field).build())
    requiredFieldValidation.forEach((validator) => composite.validator(new RequestBodyValidation(validator)))

    expect(composite.build()).toEqual(makeValidationComposite())
  })
})
