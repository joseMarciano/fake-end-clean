import { RequiredFieldValidation } from './RequiredFieldValidation'

describe('RequiredFieldValidation', () => {
  test('Should build correctly', () => {
    const sut = RequiredFieldValidation.builder()
      .field('any_name')
      .build()

    expect(sut.field).toBe('any_name')
  })
})
