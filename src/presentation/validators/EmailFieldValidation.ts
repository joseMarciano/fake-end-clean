import { EmailValidator } from '../../data/protocols/validators/EmailValidator'
import { InvalidParamError } from '../controllers/errors/InvalidParamError'
import { Validator } from '../protocols'

export class EmailFieldValidation implements Validator {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error | null {
    const emailIsValid = this.emailValidator.validate(input)

    if (!emailIsValid) return new InvalidParamError('email')

    return null
  }
}
