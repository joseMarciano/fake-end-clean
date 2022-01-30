import { Validator } from '../protocols'
import { ValidationErrorComposite } from './ValidationErrorComposite'

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidatorStub()
}

describe('ValidationErrorComposite', () => {
  test('Should build correctly', () => {
    const sut = ValidationErrorComposite
      .builder()
      .validator(makeValidatorStub())
      .validator(makeValidatorStub())
      .build()

    expect(sut.validators.length).toBe(2)
  })
})
