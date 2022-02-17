import { EmailValidator } from '../../data/protocols/validators/EmailValidator'
import { InvalidParamError } from '../errors/InvalidParamError'
import { Validator } from '../protocols'

export class EmailFieldValidation implements Validator {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly fieldName: string
  ) {}

  validate (input: any): Error | null {
    const emailIsValid = this.emailValidator.validate(input[this.fieldName])

    if (!emailIsValid) return new InvalidParamError('email')

    return null
  }
}
