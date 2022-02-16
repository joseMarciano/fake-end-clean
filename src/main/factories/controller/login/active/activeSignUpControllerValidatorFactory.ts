import { RequiredFieldValidation } from '../../../../../presentation/validators/RequiredFieldValidation'
import { Validator } from '../../../../../presentation/protocols'

export const makeActiveUserValidator = (): Validator => {
  return RequiredFieldValidation
    .builder()
    .field('user')
    .build()
}
