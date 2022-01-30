import { MissingParamError } from '../controllers/errors/MissingParamError'
import { RequiredFieldValidation } from './RequiredFieldValidation'

describe('RequiredFieldValidation', () => {
  test('Should build correctly', () => {
    const sut = RequiredFieldValidation.builder()
      .field('any_name')
      .build()

    expect(sut.field).toBe('any_name')
  })

  test('Should return MissingParamError if param is not provided', () => {
    const sut = RequiredFieldValidation.builder()
      .field('name')
      .build()

    const error = sut.validate({})

    expect(error).toEqual(new MissingParamError('name'))
  })

  test('Should return null if param is provided', () => {
    const sut = RequiredFieldValidation.builder()
      .field('name')
      .build()

    const error = sut.validate({
      name: 'any_name'
    })

    expect(error).toBeNull()
  })
})
