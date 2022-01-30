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

  test('Should return an error if validate fails', () => {
    const validationStub = makeValidatorStub()

    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => new Error())

    const sut = ValidationErrorComposite
      .builder()
      .validator(validationStub)
      .validator(validationStub)
      .build()

    const error = sut.validate({})

    expect(error).toEqual(new Error())
  })

  test('Should return null if validate succeeds', () => {
    const validationStub = makeValidatorStub()

    const sut = ValidationErrorComposite
      .builder()
      .validator(validationStub)
      .validator(validationStub)
      .build()

    const error = sut.validate({})

    expect(error).toBeNull()
  })
})
