import { RequiredFieldValidation } from '../../../../../presentation/validators/RequiredFieldValidation'
import { Validator } from '../../../../../presentation/protocols'
import { ValidationErrorComposite } from '../../../../../presentation/validators/ValidationErrorComposite'
import { makeValidationComposite } from './addProjectValidationCompositeFactory'
import { RequestBodyValidation } from '../../../../../presentation/validators/RequestBodyValidation'
import { RequestParamValidation } from '../../../../../presentation/validators/RequestParamsValidation'

describe('addProjectValidationCompositeFactory', () => {
  test('Should call ValidatorComposite with all Validators', () => {
    const sut = makeValidationComposite() as ValidationErrorComposite

    const validators: Validator[] = []

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

    validators.push(requestBodyValidaton)
    validators.push(requestParamsValidaton)

    expect(sut.validators).toEqual(validators)
  })
})
