import { InvalidParamError } from '../controllers/errors/InvalidParamError'
import { CompareFieldsValidation } from './CompareFieldsValidaton'

describe('CompareFieldsValition', () => {
  test('Should build correctly', () => {
    const sut = CompareFieldsValidation.builder()
      .field('password')
      .fieldToCompare('passwordConfirmation')
      .build()

    expect(sut.field).toBe('password')
    expect(sut.fieldToCompare).toBe('passwordConfirmation')
  })

  test('Should return InvalidParamError if fields not match', () => {
    const sut = CompareFieldsValidation.builder()
      .field('password')
      .fieldToCompare('passwordConfirmation')
      .build()

    const error = sut.validate({
      password: 'any_password',
      passwordConfirmation: 'different_password'
    })

    expect(error).toEqual(new InvalidParamError('passwordConfirmation'))
  })
})
