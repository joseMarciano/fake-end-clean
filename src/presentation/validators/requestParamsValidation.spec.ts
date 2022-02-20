import { Validator } from '../protocols'
import { RequestParamValidation } from './RequestParamsValidation'

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (_input: any): Error | null {
      return null
    }
  }

  return new ValidatorStub()
}

interface SutTypes {
  sut: RequestParamValidation
  validationStub: Validator
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidator()
  const sut = new RequestParamValidation(validationStub)
  return {
    sut,
    validationStub
  }
}

describe('RequestParamValidation', () => {
  test('Should call Validator with correct values', () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    sut.validate({
      params: {
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
      params: {
        field: 'any_field',
        otherField: 'any_field'
      }
    })

    expect(error).toEqual(new Error())
  })

  test('Should return null if Validator return null', () => {
    const { sut } = makeSut()

    const error = sut.validate({
      params: {
        field: 'any_field',
        otherField: 'any_field'
      }
    })

    expect(error).toBeNull()
  })
})
