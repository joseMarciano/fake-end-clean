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
})
