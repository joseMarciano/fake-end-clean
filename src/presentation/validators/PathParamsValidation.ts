import { Validator } from '../protocols'

export class PathParamValidation implements Validator {
  constructor (
    private readonly validator: Validator
  ) {}

  validate (input: any): Error | null {
    return this.validator.validate(input.paths)
  }
}
