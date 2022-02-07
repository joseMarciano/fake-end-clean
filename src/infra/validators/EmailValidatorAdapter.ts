import IsEmail from 'isemail'
import { EmailValidator } from 'src/data/protocols/validators/EmailValidator'

export class EmailValidatorAdapter implements EmailValidator {
  validate (input: string): boolean {
    return IsEmail.validate(input)
  }
}
