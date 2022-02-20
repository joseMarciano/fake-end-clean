import { Validator } from '../protocols'

export class ParamsValidaton implements Validator {
  constructor (
    private readonly validator: Validator
  ) {}

  validate (input: any): Error | null {
    return this.validator.validate(input.params)
  }
}
