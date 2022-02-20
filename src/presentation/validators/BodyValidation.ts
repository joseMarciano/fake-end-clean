import { Validator } from '../protocols'

export class BodyValidation implements Validator {
  constructor (
    private readonly validator: Validator
  ) {}

  validate (input: any): Error | null {
    this.validator.validate(input.body)
    return null
  }
}
