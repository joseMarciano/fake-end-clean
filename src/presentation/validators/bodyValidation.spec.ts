import { Validator } from '../protocols'
import { BodyValidation } from './BodyValidation'

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (_input: any): Error | null {
      return null
    }
  }

  return new ValidatorStub()
}

interface SutTypes {
  sut: BodyValidation
  validationStub: Validator
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidator()
  const sut = new BodyValidation(validationStub)
  return {
    sut,
    validationStub
  }
}

describe('BodyValidation', () => {
  test('Should call validator with correct values', () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    sut.validate({
      body: {
        field: 'any_field',
        otherField: 'any_field'
      }
    })

    expect(validateSpy).toHaveBeenCalledWith({
      field: 'any_field',
      otherField: 'any_field'
    })
  })

  test('Should return an Error if Validator return an Error', () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

    const error = sut.validate({
      body: {
        field: 'any_field',
        otherField: 'any_field'
      }
    })

    expect(error).toEqual(new Error())
  })
})
