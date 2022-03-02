import { RequiredFieldValidation } from '../../../../../presentation/validators/RequiredFieldValidation'
import { Validator } from '../../../../../presentation/protocols'
import { ValidationErrorComposite } from '../../../../../presentation/validators/ValidationErrorComposite'
import { makeValidationComposite } from './addProjectValidationCompositeFactory'
import { RequestBodyValidation } from '../../../../../presentation/validators/RequestBodyValidation'

describe('addProjectValidationCompositeFactory', () => {
  test('Should call ValidatorComposite with all Validators', () => {
    const sut = makeValidationComposite() as ValidationErrorComposite

    const validators: Validator[] = []

    const bodyRequiredFieldValidation = RequiredFieldValidation
      .builder()
      .field('title')
      .field('description')
      .build()

    const requestBodyValidaton = new RequestBodyValidation(bodyRequiredFieldValidation)

    validators.push(requestBodyValidaton)

    expect(sut.validators).toEqual(validators)
  })
})
