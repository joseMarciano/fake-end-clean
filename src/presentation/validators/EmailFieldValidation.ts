import { EmailValidator } from '../../data/protocols/validators/EmailValidator'
import { Validator } from '../protocols'

export class EmailFieldValidation implements Validator {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error | null {
    this.emailValidator.validate(input)
    return null
  }
}
